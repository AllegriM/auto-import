import db from '../db.js';

export const list = (req,res)=>{
  res.json(db.prepare('SELECT * FROM empleados ORDER BY nombre').all());
};

export const get = (req,res)=>{
  const row = db.prepare('SELECT * FROM empleados WHERE id=?').get(req.params.id);
  if(!row) return res.status(404).json({error:'Not found'});
  res.json(row);
};

export const create = (req,res)=>{
  const { nombre, legajo, rol } = req.body;
  const info = db.prepare('INSERT INTO empleados (nombre,legajo,rol) VALUES (?,?,?)').run(nombre, legajo || null, rol || null);
  res.json({id: info.lastInsertRowid});
};

export const update = (req,res)=>{
  const { nombre, legajo, rol } = req.body;
  db.prepare('UPDATE empleados SET nombre=?, legajo=?, rol=? WHERE id=?').run(nombre, legajo||null, rol||null, req.params.id);
  res.json({ok:true});
};

export const remove = (req,res)=>{
  db.prepare('DELETE FROM empleados WHERE id=?').run(req.params.id);
  res.json({ok:true});
};

export default { list, get, create, update, remove };
