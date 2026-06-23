import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import * as invoiceController from "./invoice.controller.js";

const router = express.Router();

// Admin routes
router.get("/", protect, authorize("admin"), invoiceController.getAll);
router.get("/stats", protect, authorize("admin"), invoiceController.getStats);
router.post("/", protect, authorize("admin"), invoiceController.generate);
router.get("/:id", protect, authorize("admin"), invoiceController.getById);
router.patch("/:id/status", protect, authorize("admin"), invoiceController.updateStatus);
router.post("/calculate", protect, authorize("admin"), invoiceController.calculate);

// User routes (buyer/seller dashboard)
router.get("/my/invoices", protect, invoiceController.getMyInvoices);

export default router;