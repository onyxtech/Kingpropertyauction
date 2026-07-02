import express from 'express';
import { getAllUsers, updateUserStatus, updateUser, getUserById, getUserProperties, getUserAuctions, getUserBids, getUserDocuments, getUserPayments, getUserActivity, requestRoleSwitch, switchActiveView, reviewRoleRequest, uploadIdDocument, verifyIdDocument, deleteIdDocument } from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { uploadIdDocument as uploadIdDoc } from '../../middlewares/upload.middleware.js';

const router = express.Router();

// ─── Public / Non-dynamic Routes ──────────────────────────────────────
router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/request-role', protect, requestRoleSwitch);
router.post('/switch-view', protect, switchActiveView);

// ─── ID Document Routes (Static - MUST BE BEFORE /:id ROUTES) ────────
router.post(
  "/upload-id-document",
  protect,
  uploadIdDoc,
  uploadIdDocument,
);

router.put(
  "/verify-id-document",
  protect,
  authorize("admin"),
  verifyIdDocument,
);

router.delete(
  "/delete-id-document",
  protect,
  deleteIdDocument,
);

// ─── Dynamic Routes (/:id) - MUST BE LAST ────────────────────────────
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);
router.patch('/:id/review-role', protect, authorize('admin'), reviewRoleRequest);
router.put('/:id', protect, authorize('admin'), updateUser);
router.get('/:id', protect, authorize('admin'), getUserById);
router.get('/:id/properties', protect, authorize('admin'), getUserProperties);
router.get('/:id/auctions', protect, authorize('admin'), getUserAuctions);
router.get('/:id/bids', protect, authorize('admin'), getUserBids);
router.get('/:id/documents', protect, authorize('admin'), getUserDocuments);
router.get('/:id/payments', protect, authorize('admin'), getUserPayments);
router.get('/:id/activity', protect, authorize('admin'), getUserActivity);

export default router;