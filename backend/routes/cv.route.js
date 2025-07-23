import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { createCV, deleteCV, getCV, updateCV } from "../controllers/cv.controller.js";

const router = express.Router();

router.route("/create-cv").post(isAuthenticated, singleUpload, createCV);
router.route("/get/:id").get(isAuthenticated, getCV);
router.route("/delete-cv/:id").delete(isAuthenticated, deleteCV);
router.route("/update-cv/:id").put(isAuthenticated, singleUpload, updateCV);


export default router;