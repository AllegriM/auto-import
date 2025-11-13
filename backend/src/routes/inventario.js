import express from 'express';
import ctrl from '../controllers/inventario.ctrl.js';
const router = express.Router();
router.get('/', ctrl.list); // lista inventario (detallado)
router.get('/by-articulo/:id', ctrl.byArticulo); // inventario por articulo
router.post('/adjust', ctrl.adjust); // ajustar inventario (y opcional crear historial)
export default router;
