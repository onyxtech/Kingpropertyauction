import express from 'express';
import { create, getAll, getById, update, remove, start, end, cancel } from './auction.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, authorize('admin', 'agent'), create);
router.put('/:id', protect, authorize('admin', 'agent'), update);
router.delete('/:id', protect, authorize('admin'), remove);
router.patch('/:id/start', protect, authorize('admin'), start);
router.patch('/:id/end', protect, authorize('admin'), end);
router.patch('/:id/cancel', protect, authorize('admin'), cancel);

export default router;