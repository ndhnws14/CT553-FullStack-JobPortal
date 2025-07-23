import express from "express";
import {
    deleteUser,
    followCompany,
    getAllUsers,
    getLovedJobs,
    getMe,
    getSavedJobs, 
    login, 
    loginGoogle, 
    logout, 
    loveJob, 
    register, 
    removeLovedJob, 
    removeSavedJob, 
    resetPassword, 
    saveJob, 
    unFollowCompany, 
    updateProfile 
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/login-google").post(loginGoogle);
router.route("/logout").get(logout);
router.route("/reset-password").post(isAuthenticated, resetPassword);
router.route("/me").get(isAuthenticated, getMe);
router.route("/all-users").get(isAuthenticated, isAdmin, getAllUsers);
router.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteUser);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/save/:id").post(isAuthenticated, saveJob);
router.route("/love/:id").post(isAuthenticated, loveJob);
router.route("/follow/:id").post(isAuthenticated, followCompany);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);
router.route("/loved-jobs").get(isAuthenticated, getLovedJobs);
router.route("/unsave/:id").delete(isAuthenticated, removeSavedJob);
router.route("/unlove/:id").delete(isAuthenticated, removeLovedJob);
router.route("/unfollow/:id").delete(isAuthenticated, unFollowCompany);

export default router;
