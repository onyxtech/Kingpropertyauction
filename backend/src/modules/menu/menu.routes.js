import express from "express";
import { create, getAll, getById, update, remove, duplicate } from "./menu.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

// PUBLIC - anyone can read menus (needed for Header/Footer)
router.get("/", getAll);

// ADMIN only - create, edit, delete
router.post("/", protect, authorize("admin"), create);
router.get("/:id", protect, authorize("admin"), getById);
router.put("/:id", protect, authorize("admin"), update);
router.delete("/:id", protect, authorize("admin"), remove);
router.post("/:id/duplicate", protect, authorize("admin"), duplicate);

export default router;