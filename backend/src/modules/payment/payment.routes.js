import express from "express";
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { getAll, getMyPayments, create, updateStatus } from "./payment.controller.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAll);
router.get("/my", protect, getMyPayments);
router.post("/", protect, authorize("admin"), create);
router.patch("/:id/status", protect, authorize("admin"), updateStatus);

export default router;
