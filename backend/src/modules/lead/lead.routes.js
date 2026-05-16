import express from 'express';
import { create, getAll, getById, update, remove, addNote, getStats, getMyLeads, replyToLead } from './lead.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

// ─── Public ───
router.post('/', create);

// ─── Customer (logged-in user sees their own leads) ───
router.get('/my', protect, getMyLeads);

// ─── Admin ───
router.get('/stats',     protect, authorize('admin'), getStats);
router.get('/',          protect, authorize('admin', 'agent'), getAll);
router.post('/:id/reply', protect, authorize('admin', 'agent'), replyToLead);
router.get('/:id',       protect, authorize('admin', 'agent'), getById);
router.put('/:id',       protect, authorize('admin'), update);
router.delete('/:id',    protect, authorize('admin'), remove);
router.post('/:id/notes', protect, authorize('admin'), addNote);

export default router;
