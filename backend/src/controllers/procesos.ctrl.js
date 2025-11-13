import db from '../db.js';

export const list = (req,res)=>{
  res.json(db.prepare('SELECT * FROM procesos ORDER BY id').all());
};

export const create = (req,res)=>{
  const info = db.prepare('INSERT INTO procesos (nombre) VALUES (?)').run(req.body.nombre);
  res.json({id: info.lastInsertRowid});
};

export const update = (req,res)=>{
  db.prepare('UPDATE procesos SET nombre=? WHERE id=?').run(req.body.nombre, req.params.id);
  res.json({ok:true});
};

export const remove = (req,res)=>{
  db.prepare('DELETE FROM procesos WHERE id=?').run(req.params.id);
  res.json({ok:true});
};

export default { list, create, update, remove };
