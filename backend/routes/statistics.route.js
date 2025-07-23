import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getAdminStatistics, getEmployerStatistics } from "../controllers/statistics.controller.js";

const router = express.Router();

router.route("/employer").get(isAuthenticated, getEmployerStatistics);
router.route("/admin").get(isAuthenticated, isAdmin, getAdminStatistics);

export default router;