import express from 'express';
import ctrl from '../controllers/procesos.ctrl.js';
const router = express.Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
export default router;
