import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const DB_FILE = path.join(DATA_DIR, 'produccion.db');
const db = new Database(DB_FILE);

// Inicializar tablas desde init.sql si no existen
const initSqlPath = path.join(__dirname, 'init.sql');
if (fs.existsSync(initSqlPath)) {
  const initSql = fs.readFileSync(initSqlPath, 'utf8');
  db.exec(initSql);
} else {
  console.warn('init.sql no encontrado en', initSqlPath);
}

export default db;
