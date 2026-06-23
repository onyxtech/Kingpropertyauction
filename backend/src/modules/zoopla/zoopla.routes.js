import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { testConnection } from "./zoopla.service.js";

const router = express.Router();

// Test Zoopla connection
router.post("/test", protect, authorize("admin"), async (req, res) => {
  try {
    const result = await testConnection();
    res.json({ success: result.success, message: result.message });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;