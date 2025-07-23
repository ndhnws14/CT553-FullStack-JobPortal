import express from "express";
import { deleteCompany, getAllCompany, getCompany, getCompanyByEmployer, getCompanyById, getJobsByCompany, registerCompany, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { multipleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(getAllCompany);
router.route("/:id/jobs").get(getJobsByCompany);
router.route("/get/:id").get(getCompanyById);
router.route("/get-company/:id").get(isAuthenticated, getCompanyByEmployer);
router.route("/admin-getcompany").get(isAuthenticated,getCompany);
router.route("/update/:id").put(isAuthenticated, multipleUpload, updateCompany);
router.route("/delete-company/:id").delete(isAuthenticated, deleteCompany);

export default router;
