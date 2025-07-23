import express from "express";
import {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
  getLevelById,
} from "../controllers/level.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/create-level").post(isAuthenticated, isAdmin, createLevel);
router.route("/get").get(getAllLevels);
router.route("/get/:id").get(getLevelById);
router.route("/update-level/:id").put(isAuthenticated, isAdmin, updateLevel);
router.route("/delete-level/:id").delete(isAuthenticated, isAdmin, deleteLevel);

export default router;
