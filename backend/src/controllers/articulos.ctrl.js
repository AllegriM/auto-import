import db from '../db.js';

export const list = (req,res)=>{
  const rows = db.prepare(`
    SELECT a.*, m.nombre as modelo_nombre
    FROM articulos a
    LEFT JOIN modelos m ON a.id_modelo = m.id
    ORDER BY a.nombre
  `).all();
  res.json(rows);
};

export const get = (req,res)=>{
  const row = db.prepare('SELECT * FROM articulos WHERE id=?').get(req.params.id);
  if(!row) return res.status(404).json({error:'Not found'});
  res.json(row);
};

export const create = (req,res)=>{
  const { id_modelo, nombre, tipo } = req.body;
  const info = db.prepare('INSERT INTO articulos (id_modelo,nombre,tipo) VALUES (?,?,?)').run(id_modelo||null, nombre, tipo);
  res.json({id: info.lastInsertRowid});
};

export const update = (req,res)=>{
  const id = req.params.id;
  const { id_modelo, nombre, tipo } = req.body;
  db.prepare('UPDATE articulos SET id_modelo=?, nombre=?, tipo=? WHERE id=?').run(id_modelo||null, nombre, tipo, id);
  res.json({ok:true});
};

export const remove = (req,res)=>{
  db.prepare('DELETE FROM articulos WHERE id=?').run(req.params.id);
  res.json({ok:true});
};

export default { list, get, create, update, remove };
