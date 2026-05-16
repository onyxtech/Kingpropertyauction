import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { getAll, create, update, remove, toggle } from './knowledge.controller.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAll);
router.post('/', protect, authorize('admin'), create);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);
router.patch('/:id/toggle', protect, authorize('admin'), toggle);

export default router;
