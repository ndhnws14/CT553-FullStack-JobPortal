import express from "express";
import {
  createLevel,
  getAllLevels,
  updateLevel,
  deleteLevel,
  getLevelById,
} from "../controllers/level.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.route("/create-level").post(isAuthenticated, authorizeRoles(ROLES.ADMIN), createLevel);
router.route("/get").get(getAllLevels);
router.route("/get/:id").get(getLevelById);
router.route("/update-level/:id").put(isAuthenticated, authorizeRoles(ROLES.ADMIN), updateLevel);
router.route("/delete-level/:id").delete(isAuthenticated, authorizeRoles(ROLES.ADMIN), deleteLevel);

export default router;
