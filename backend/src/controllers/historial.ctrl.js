import db from '../db.js';

export const list = (req,res)=>{
  const limit = parseInt(req.query.limit) || 200;
  const rows = db.prepare(`
    SELECT h.*, a.nombre as articulo, p.nombre as proceso, e.nombre as empleado
    FROM historial h
    JOIN articulos a ON h.id_articulo = a.id
    JOIN procesos p ON h.id_proceso = p.id
    LEFT JOIN empleados e ON h.id_empleado = e.id
    ORDER BY h.fecha DESC
    LIMIT ?
  `).all(limit);
  res.json(rows);
};

export const byEmployee = (req,res)=>{
  const id = req.params.id;
  const from = req.query.from; // YYYY-MM-DD
  const to = req.query.to;
  let rows;
  if (from && to) {
    rows = db.prepare(`
      SELECT h.*, a.nombre as articulo, p.nombre as proceso
      FROM historial h
      JOIN articulos a ON h.id_articulo = a.id
      JOIN procesos p ON h.id_proceso = p.id
      WHERE h.id_empleado = ? AND date(h.fecha) BETWEEN ? AND ?
      ORDER BY h.fecha DESC
    `).all(id, from, to);
  } else {
    rows = db.prepare(`
      SELECT h.*, a.nombre as articulo, p.nombre as proceso
      FROM historial h
      JOIN articulos a ON h.id_articulo = a.id
      JOIN procesos p ON h.id_proceso = p.id
      WHERE h.id_empleado = ?
      ORDER BY h.fecha DESC
    `).all(id);
  }
  res.json(rows);
};

export const byDate = (req,res)=>{
  const date = req.query.date;
  if (!date) return res.status(400).json({error:'date required YYYY-MM-DD'});
  const rows = db.prepare(`
    SELECT h.*, a.nombre as articulo, p.nombre as proceso, e.nombre as empleado
    FROM historial h
    JOIN articulos a ON h.id_articulo = a.id
    JOIN procesos p ON h.id_proceso = p.id
    LEFT JOIN empleados e ON h.id_empleado = e.id
    WHERE date(h.fecha) = ?
    ORDER BY h.fecha ASC
  `).all(date);
  res.json(rows);
};

export const create = (req,res)=>{
  const { id_articulo, id_proceso, cantidad, fecha, observacion, id_empleado } = req.body;
  const info = db.prepare('INSERT INTO historial (id_articulo,id_proceso,cantidad,fecha,observacion,id_empleado) VALUES (?,?,?,?,?,?)')
    .run(id_articulo, id_proceso, cantidad, fecha || new Date().toISOString(), observacion || null, id_empleado || null);
  res.json({id: info.lastInsertRowid});
};

export const performanceSummary = (req,res)=>{
  const id = req.params.id;
  const date = req.query.date; // YYYY-MM-DD
  if (!date) return res.status(400).json({error:'date required'});
  const rows = db.prepare(`
    SELECT p.nombre as proceso, SUM(h.cantidad) as total
    FROM historial h
    JOIN procesos p ON h.id_proceso = p.id
    WHERE h.id_empleado = ? AND date(h.fecha) = ?
    GROUP BY p.id
  `).all(id, date);
  res.json(rows);
};

export const productionByDate = (req,res)=>{
  const date = req.query.date;
  if(!date) return res.status(400).json({error:'date required'});
  const rows = db.prepare(`
    SELECT a.id_modelo, mo.nombre as modelo, SUM(h.cantidad) as total
    FROM historial h
    JOIN articulos a ON h.id_articulo = a.id
    LEFT JOIN modelos mo ON a.id_modelo = mo.id
    WHERE date(h.fecha) = ? AND h.cantidad > 0
    GROUP BY a.id_modelo
  `).all(date);
  res.json(rows);
};

export default { list, byEmployee, byDate, create, performanceSummary, productionByDate };
