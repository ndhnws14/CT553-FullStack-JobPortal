import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { createSkill, getAllSkills, getRequest, removeRequestSkill, removeSkill, requestSkill, updateSkill, updateStatusRequest } from "../controllers/techskill.controller.js";

const router = express.Router();

router.route("/create-skill").post(isAuthenticated, isAdmin, createSkill);
router.route("/update-skill/:id").put(isAuthenticated, isAdmin, updateSkill);
router.route("/remove-skill/:id").delete(isAuthenticated, isAdmin, removeSkill);
router.route("/skills").get(getAllSkills);
router.route("/request-skill").post(isAuthenticated, requestSkill);
router.route("/request").get(isAuthenticated, getRequest);
router.route("/update-status/:id").put(isAuthenticated, updateStatusRequest);
router.route("/delete-request/:id").delete(isAuthenticated, removeRequestSkill);

export default router;