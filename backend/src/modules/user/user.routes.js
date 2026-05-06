import express from 'express';
import { getAllUsers, updateUserStatus, updateUser } from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';


const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);
router.put('/:id', protect, authorize('admin'), updateUser);

export default router;