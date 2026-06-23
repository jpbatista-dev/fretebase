import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  findAll,
  findOne,
  create,
  update,
  remove,
  getReport,
} from "../controllers/drivers.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", findAll);
router.get("/:id", findOne);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);
router.get("/:id/report", getReport);

export default router;
