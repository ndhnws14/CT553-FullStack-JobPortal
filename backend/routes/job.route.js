import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteJob, getAdminJobById, getAdminJobs, getAllJobs, getJobById, getPopularJob, postJob, updateJob } from "../controllers/job.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);
router.route("/get-popular").get(getPopularJob);
router.route("/get-job/:id").get(isAuthenticated, getAdminJobById);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateJob);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;
