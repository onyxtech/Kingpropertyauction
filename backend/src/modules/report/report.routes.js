import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { overview, customers, agents, auctions, bids, agentProperties, customerProperties } from "./report.controller.js";

const router = express.Router();

router.get("/overview", protect, authorize("admin"), overview);
router.get("/customers", protect, authorize("admin"), customers);
router.get("/agents", protect, authorize("admin"), agents);
router.get("/auctions", protect, authorize("admin"), auctions);
router.get("/bids", protect, authorize("admin"), bids);
router.get("/agent-properties", protect, authorize("admin"), agentProperties);
router.get("/customer-properties", protect, authorize("admin"), customerProperties);

export default router;