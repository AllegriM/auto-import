import express from 'express';
import ctrl from '../controllers/modelos.ctrl.js';
const router = express.Router();
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
export default router;
