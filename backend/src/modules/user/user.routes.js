import express from 'express';
import { getAllUsers, updateUserStatus, updateUser, getUserById, requestRoleSwitch, switchActiveView, reviewRoleRequest } from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';


const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/request-role', protect, requestRoleSwitch);
router.post('/switch-view', protect, switchActiveView);
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);
router.patch('/:id/review-role', protect, authorize('admin'), reviewRoleRequest);
router.put('/:id', protect, authorize('admin'), updateUser);
router.get('/:id', protect, authorize('admin'), getUserById);

export default router;