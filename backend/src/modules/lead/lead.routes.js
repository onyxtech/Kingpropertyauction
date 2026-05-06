import express from 'express';
import { create, getAll, update, remove } from './lead.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', create); // Public
router.get('/', protect, authorize('admin', 'agent'), getAll);
router.put('/:id', protect, authorize('admin'), update);
router.delete('/:id', protect, authorize('admin'), remove);

export default router;