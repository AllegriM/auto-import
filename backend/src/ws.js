import WebSocket, { WebSocketServer } from 'ws';
import db from './db.js';

let wss = null;

export function init(server) {
  wss = new WebSocketServer({ server });
  wss.on('connection', (socket) => {
    console.log('WS client connected');
    try {
      const rows = db.prepare(`
        SELECT inv.*, a.nombre as articulo, p.nombre as proceso, m.nombre as modelo
        FROM inventario inv
        JOIN articulos a ON inv.id_articulo = a.id
        LEFT JOIN procesos p ON inv.id_proceso = p.id
        LEFT JOIN modelos m ON a.id_modelo = m.id
        ORDER BY m.nombre, a.nombre, p.id
      `).all();
      socket.send(JSON.stringify({ type: 'inventario_snapshot', data: rows }));
    } catch (e) {
      console.error('WS init send error', e);
    }
  });
}

export function broadcastInventario() {
  if (!wss) return;
  const rows = db.prepare(`
    SELECT inv.*, a.nombre as articulo, p.nombre as proceso, m.nombre as modelo
    FROM inventario inv
    JOIN articulos a ON inv.id_articulo = a.id
    LEFT JOIN procesos p ON inv.id_proceso = p.id
    LEFT JOIN modelos m ON a.id_modelo = m.id
    ORDER BY m.nombre, a.nombre, p.id
  `).all();

  const msg = JSON.stringify({ type: 'inventario_update', data: rows });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}
