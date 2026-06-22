import express from "express";
import { submit, getAll, getById, update, getStats, acceptOffer, declineOffer, getAgentOffers } from "./offer.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Public - anyone can submit an offer (guest or logged in)
router.post("/", submit);

// Admin routes
router.get("/", protect, authorize("admin", "agent"), getAll);
router.get("/stats", protect, authorize("admin", "agent"), getStats);
router.get("/:id", protect, authorize("admin", "agent"), getById);
router.put("/:id", protect, authorize("admin"), update);

router.put("/:id/accept", protect, authorize("admin"), acceptOffer);
router.put("/:id/decline", protect, authorize("admin"), declineOffer);
router.get("/agent/my", protect, getAgentOffers);

export default router;