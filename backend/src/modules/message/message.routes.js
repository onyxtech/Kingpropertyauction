import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  getConversations,
  getConversation,
  updateConversation,
  getMessages,
  sendMessage,
  sendUserMessage,
  getUserMessages,
  getStats,
  convertLeadToConversation,
  getUserConversations,
  createUserConversation,
  updateUserConversation,
} from './message.controller.js';

const router = express.Router();

// ─── Stats (must be before /:id to avoid conflict) ───
router.get('/stats', protect, authorize('admin'), getStats);

// ─── User routes (must be before /:id) ───
router.post('/my/new',          protect, createUserConversation);
router.get('/my/list',          protect, getUserConversations);
router.get('/my/:id/messages',  protect, getUserMessages);
router.post('/my/:id/messages', protect, sendUserMessage);
router.put('/my/:id/update',    protect, updateUserConversation);

// ─── Convert lead (must be before /:id) ───
router.post('/convert/:leadId', protect, authorize('admin'), convertLeadToConversation);

// ─── Admin routes ───
router.get('/',          protect, authorize('admin'), getConversations);
router.get('/:id',       protect, authorize('admin'), getConversation);
router.put('/:id',       protect, authorize('admin'), updateConversation);
router.get('/:id/messages',  protect, authorize('admin'), getMessages);
router.post('/:id/messages', protect, authorize('admin'), sendMessage);

export default router;