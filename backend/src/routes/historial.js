import express from 'express';
import ctrl from '../controllers/historial.ctrl.js';
const router = express.Router();
router.get('/', ctrl.list); // listar historial (opcional paginado)
router.get('/by-employee/:id', ctrl.byEmployee); // historial por empleado (filtro por fecha con query)
router.get('/by-date', ctrl.byDate); // ?date=YYYY-MM-DD
router.post('/', ctrl.create);
router.get('/performance/:id', ctrl.performanceSummary);
router.get('/production', ctrl.productionByDate);
export default router;
