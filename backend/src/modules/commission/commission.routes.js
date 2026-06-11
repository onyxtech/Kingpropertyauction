import express from "express";
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  getAll,
  getMyCommissions,
  create,
  updateStatus,
  updateAgentRate,
  requestWithdrawal,
} from "./commission.controller.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAll);
router.get("/my", protect, getMyCommissions);
router.post("/", protect, authorize("admin"), create);
router.patch("/:id/status", protect, authorize("admin"), updateStatus);
router.post("/:id/withdraw", protect, requestWithdrawal);
router.patch(
  "/agent/:agentId/rate",
  protect,
  authorize("admin"),
  updateAgentRate,
);

export default router;
