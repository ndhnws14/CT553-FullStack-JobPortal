import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, deleteApplicant, getAllApplicants, getApplicants, getAppliedJobs, setInterview, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/applicants").get(isAuthenticated, getAllApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/schedule/:id").post(isAuthenticated, setInterview);
router.route("/delete/:id").delete(isAuthenticated, deleteApplicant);

export default router;