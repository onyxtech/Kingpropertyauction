import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
  start,
  end,
  cancel,
  completeAuctionController,
  checkEndedAuctionsController,
} from "./auction.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

// PUBLIC routes (no auth)
router.get("/", getAll);
router.post("/check-ended-public", checkEndedAuctionsController);
router.get("/:id", getById);

// PROTECTED routes (require auth)
router.post("/", protect, authorize("admin", "agent"), create);
router.put("/:id", protect, authorize("admin", "agent"), update);
router.delete("/:id", protect, authorize("admin"), remove);
router.patch("/:id/start", protect, authorize("admin"), start);
router.patch("/:id/end", protect, authorize("admin"), end);
router.patch("/:id/cancel", protect, authorize("admin"), cancel);
router.patch(
  "/:id/complete",
  protect,
  authorize("admin"),
  completeAuctionController,
);
router.post(
  "/check-ended",
  protect,
  authorize("admin"),
  checkEndedAuctionsController,
);

export default router;
