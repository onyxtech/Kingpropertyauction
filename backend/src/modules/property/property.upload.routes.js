import express from 'express';
import { uploadImages, uploadVideo, uploadFloorPlan, uploadLegalDocs } from './property.upload.controller.js';
import { uploadPropertyImages, uploadPropertyVideo, uploadFloorPlan as uploadFP, uploadLegalDocs as uploadLD } from '../../middlewares/upload.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/images', protect, authorize('admin', 'agent'), uploadPropertyImages, uploadImages);
router.post('/video', protect, authorize('admin', 'agent'), uploadPropertyVideo, uploadVideo);
router.post('/floorplan', protect, authorize('admin', 'agent'), uploadFP, uploadFloorPlan);
router.post('/documents', protect, authorize('admin', 'agent'), uploadLD, uploadLegalDocs);

export default router;