import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  findAll,
  findOne,
  create,
  updateStatus,
  getDashboard,
} from "../controllers/trips.controller.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", getDashboard);
router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", create);
router.patch("/:id/status", updateStatus);

export default router;
