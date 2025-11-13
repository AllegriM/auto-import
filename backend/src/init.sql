PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS modelos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  cod_logistico TEXT,
  cod_producto TEXT,
  mac TEXT,
  tipo TEXT
);

CREATE TABLE IF NOT EXISTS articulos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_modelo INTEGER,
  nombre TEXT NOT NULL,
  tipo TEXT,
  FOREIGN KEY(id_modelo) REFERENCES modelos(id)
);

CREATE TABLE IF NOT EXISTS procesos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS inventario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_articulo INTEGER NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 0,
  id_proceso INTEGER NOT NULL,
  FOREIGN KEY(id_articulo) REFERENCES articulos(id),
  FOREIGN KEY(id_proceso) REFERENCES procesos(id)
);

CREATE TABLE IF NOT EXISTS empleados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  legajo TEXT,
  rol TEXT
);

CREATE TABLE IF NOT EXISTS historial (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_articulo INTEGER NOT NULL,
  id_proceso INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  fecha DATETIME DEFAULT (datetime('now','localtime')),
  observacion TEXT,
  id_empleado INTEGER,
  FOREIGN KEY(id_articulo) REFERENCES articulos(id),
  FOREIGN KEY(id_proceso) REFERENCES procesos(id),
  FOREIGN KEY(id_empleado) REFERENCES empleados(id)
);

-- Inserts de ejemplo
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (1, 'Deposito');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (2, 'Actualizado');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (3, 'Probado');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (4, 'Tapa frente sucia');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (5, 'Tapa trasera sucia');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (6, 'Mesa');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (7, 'Calco');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (8, 'Pintado');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (9, 'Tampografia');
INSERT OR IGNORE INTO procesos (id, nombre) VALUES (10, 'Armado');

-- WAL mode and indexes
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS resumen_diario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha DATE NOT NULL,
  id_modelo INTEGER,
  modelo TEXT,
  id_proceso INTEGER,
  proceso TEXT,
  cantidad INTEGER,
  created_at DATETIME DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_historial_empleado ON historial(id_empleado);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial(fecha);
CREATE INDEX IF NOT EXISTS idx_inventario_articulo ON inventario(id_articulo);
CREATE INDEX IF NOT EXISTS idx_inventario_proceso ON inventario(id_proceso);
