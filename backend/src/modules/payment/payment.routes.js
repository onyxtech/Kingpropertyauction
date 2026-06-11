import express from "express";
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { getAll, getMyPayments, create, updateStatus, sendReminder, assignNewBuyer, resetPropertyToAvailable, getNotifiedBidders } from "./payment.controller.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAll);
router.get("/my", protect, getMyPayments);
router.post("/", protect, authorize("admin"), create);
router.patch("/:id/status", protect, authorize("admin"), updateStatus);
router.post("/:id/remind", protect, authorize("admin"), sendReminder);
router.post("/assign-buyer", protect, authorize("admin"), assignNewBuyer);
router.post("/reset-property", protect, authorize("admin"), resetPropertyToAvailable);
router.get("/notified-bidders/:propertyId", protect, getNotifiedBidders);

export default router;
