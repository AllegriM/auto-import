import db from '../db.js';

export const list = (req, res) => {
  const rows = db.prepare('SELECT * FROM modelos ORDER BY nombre').all();
  res.json(rows);
};

export const get = (req, res) => {
  const id = req.params.id;
  const row = db.prepare('SELECT * FROM modelos WHERE id = ?').get(id);
  if (!row) return res.status(404).json({error:'Not found'});
  res.json(row);
};

export const create = (req, res) => {
  const { nombre, cod_logistico, cod_producto, mac, tipo } = req.body;
  const stmt = db.prepare('INSERT INTO modelos (nombre,cod_logistico,cod_producto,mac,tipo) VALUES (?,?,?,?,?)');
  const info = stmt.run(nombre, cod_logistico, cod_producto, mac, tipo);
  res.json({id: info.lastInsertRowid});
};

export const update = (req, res) => {
  const id = req.params.id;
  const { nombre, cod_logistico, cod_producto, mac, tipo } = req.body;
  db.prepare('UPDATE modelos SET nombre=?,cod_logistico=?,cod_producto=?,mac=?,tipo=? WHERE id=?')
    .run(nombre, cod_logistico, cod_producto, mac, tipo, id);
  res.json({ok:true});
};

export const remove = (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM modelos WHERE id=?').run(id);
  res.json({ok:true});
};

export default { list, get, create, update, remove };
