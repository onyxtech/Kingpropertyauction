import express from 'express';
import { uploadImages, uploadVideo, uploadFloorPlan, uploadLegalDocs, uploadPrivateDocuments } from './property.upload.controller.js';
import { uploadPropertyImages, uploadPropertyVideos, uploadFloorPlans, uploadLegalDocs as uploadLD, uploadPrivateDocs } from '../../middlewares/upload.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/images', protect, authorize('admin', 'agent', 'seller', 'buyer', 'user'), uploadPropertyImages, uploadImages);
router.post('/video', protect, authorize('admin', 'agent', 'seller', 'buyer', 'user'), uploadPropertyVideos, uploadVideo);
router.post('/floorplan', protect, authorize('admin', 'agent', 'seller', 'buyer', 'user'), uploadFloorPlans, uploadFloorPlan);
router.post('/documents', protect, authorize('admin', 'agent', 'seller', 'buyer', 'user'), uploadLD, uploadLegalDocs);
router.post('/private-documents', protect, authorize('admin', 'agent', 'seller', 'buyer', 'user'), uploadPrivateDocs, uploadPrivateDocuments);

export default router;
