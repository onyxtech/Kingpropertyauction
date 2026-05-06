import express from 'express';
import { create, getAll, getById, update, remove, approve, getByIds } from './property.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAll);
router.get('/:id', getById);

// Protected routes
router.post('/', protect, authorize('admin', 'agent'), create);
router.put('/:id', protect, authorize('admin', 'agent'), update);
router.delete('/:id', protect, authorize('admin'), remove);
router.patch('/:id/approve', protect, authorize('admin'), approve);
router.post('/batch', getByIds);

export default router;