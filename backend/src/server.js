import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import modelosRoutes from './routes/modelos.js';
import articulosRoutes from './routes/articulos.js';
import procesosRoutes from './routes/procesos.js';
import inventarioRoutes from './routes/inventario.js';
import historialRoutes from './routes/historial.js';
import empleadosRoutes from './routes/empleados.js';

import db from './db.js';
import { init as initWS } from './ws.js';
import cron from 'node-cron';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas API
app.use('/api/modelos', modelosRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/procesos', procesosRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/empleados', empleadosRoutes);

// endpoint util: inventario total agrupado por modelo/tipo
app.get('/api/inventario/por-modelo', (req, res) => {
  const rows = db.prepare(`
    SELECT
      mo.id as id_modelo,
      mo.nombre as modelo,
      mo.tipo as tipo_modelo,
      ar.id as id_articulo,
      ar.nombre as articulo,
      SUM(inv.cantidad) as cantidad_total
    FROM inventario inv
    JOIN articulos ar ON inv.id_articulo = ar.id
    LEFT JOIN modelos mo ON ar.id_modelo = mo.id
    GROUP BY mo.id, ar.id
    ORDER BY mo.nombre, ar.nombre
  `).all();
  res.json(rows);
});

// Servir frontend si existe en frontend/build
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (_, res) => res.sendFile(path.join(frontendBuild, 'index.html')));
}

const server = http.createServer(app);
initWS(server);

// Cron jobs: resumen diario y backup
function generarResumenDiario(dateStr) {
  const rows = db.prepare(`
    SELECT a.id_modelo, mo.nombre AS modelo, h.id_proceso, p.nombre as proceso, SUM(h.cantidad) AS cantidad
    FROM historial h
    JOIN articulos a ON h.id_articulo = a.id
    LEFT JOIN modelos mo ON a.id_modelo = mo.id
    LEFT JOIN procesos p ON h.id_proceso = p.id
    WHERE date(h.fecha) = ?
    GROUP BY a.id_modelo, h.id_proceso
  `).all(dateStr);

  const insert = db.prepare(`
    INSERT INTO resumen_diario (fecha,id_modelo,modelo,id_proceso,proceso,cantidad)
    VALUES (?,?,?,?,?,?)
  `);

  const t = db.transaction((rows) => {
    rows.forEach(r => {
      insert.run(dateStr, r.id_modelo, r.modelo, r.id_proceso, r.proceso, r.cantidad || 0);
    });
  });

  try {
    t(rows);
    console.log('Resumen diario guardado para', dateStr);
  } catch (e) {
    console.error('Error guardando resumen diario', e);
  }
}

function backupDatabase() {
  const DATA_DIR = path.join(__dirname, '..', 'data');
  const backupsDir = path.join(DATA_DIR, 'backups');
  if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g,'-');
  const src = path.join(DATA_DIR, 'produccion.db');
  const dest = path.join(backupsDir, `produccion-${stamp}.db`);
  try {
    fs.copyFileSync(src, dest);
    console.log('Backup creado en', dest);
  } catch (e) {
    console.error('Error backup', e);
  }
}

// schedule: at 00:05 server time, generate summary for previous day and backup
cron.schedule('5 0 * * *', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0,10);
  generarResumenDiario(dateStr);
  backupDatabase();
});

// daily backup at 02:00
cron.schedule('0 2 * * *', () => {
  backupDatabase();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log(`Servidor backend escuchando en http://localhost:${PORT}`));
