import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { recommendByIndustry, recommendBySkill, recommendCandidates, recommendCollab, recommendSimilarJob } from "../controllers/recommend.controller.js";

const router = express.Router();

router.route("/by-skill/:id").get(isAuthenticated, recommendBySkill);
router.route("/collab/:id").get(isAuthenticated, recommendCollab);
router.route("/candidates/:id").get(isAuthenticated, recommendCandidates);
router.route("/industry/:industry").get(recommendByIndustry);
router.route("/similar-job/:id").get(recommendSimilarJob);

export default router;