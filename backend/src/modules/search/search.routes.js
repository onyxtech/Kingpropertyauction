import express from "express";
import { universalSearch } from "./search.controller.js";
const router = express.Router();
router.get("/", universalSearch);
export default router;