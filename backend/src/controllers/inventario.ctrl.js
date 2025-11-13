import db from '../db.js';
import { broadcastInventario } from '../ws.js';

export const list = (req,res)=>{
  const rows = db.prepare(`
    SELECT inv.*, a.nombre as articulo, p.nombre as proceso, m.nombre as modelo
    FROM inventario inv
    JOIN articulos a ON inv.id_articulo = a.id
    LEFT JOIN procesos p ON inv.id_proceso = p.id
    LEFT JOIN modelos m ON a.id_modelo = m.id
    ORDER BY m.nombre, a.nombre, p.id
  `).all();
  res.json(rows);
};

export const byArticulo = (req,res)=>{
  const id = req.params.id;
  const rows = db.prepare('SELECT * FROM inventario WHERE id_articulo = ?').all(id);
  res.json(rows);
};

// Ajuste de inventario: body { id_articulo, id_proceso, cantidad_delta, id_empleado, observacion }
// Si cantidad_delta puede ser positivo o negativo.
// También inserta en historial automáticamente.
export const adjust = (req,res)=>{
  const { id_articulo, id_proceso, cantidad_delta, id_empleado, observacion } = req.body;
  if (!id_articulo || typeof cantidad_delta !== 'number' || !id_proceso) return res.status(400).json({error:'Faltan campos'});

  const t = db.transaction(() => {
    // buscar fila inventario
    let row = db.prepare('SELECT * FROM inventario WHERE id_articulo = ? AND id_proceso = ?').get(id_articulo, id_proceso);
    if (row) {
      db.prepare('UPDATE inventario SET cantidad = cantidad + ? WHERE id = ?').run(cantidad_delta, row.id);
    } else {
      db.prepare('INSERT INTO inventario (id_articulo,id_proceso,cantidad) VALUES (?,?,?)').run(id_articulo, id_proceso, Math.max(0, cantidad_delta));
    }
    // historial: guardamos cantidad_delta (positivo o negativo)
    db.prepare('INSERT INTO historial (id_articulo,id_proceso,cantidad,fecha,observacion,id_empleado) VALUES (?,?,?,?,?,?)')
      .run(id_articulo, id_proceso, cantidad_delta, new Date().toISOString(), observacion || null, id_empleado || null);
  });

  try { t(); broadcastInventario(); res.json({ok:true}); }
  catch(e){ console.error(e); res.status(500).json({error:e.message}); }
};

export default { list, byArticulo, adjust };
