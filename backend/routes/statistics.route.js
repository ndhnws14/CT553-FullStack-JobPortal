import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { getAdminStatistics, getEmployerStatistics } from "../controllers/statistics.controller.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.route("/employer").get(isAuthenticated, getEmployerStatistics);
router.route("/admin").get(isAuthenticated, authorizeRoles(ROLES.ADMIN), getAdminStatistics);

export default router;