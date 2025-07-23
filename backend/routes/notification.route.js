import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { countUnread, createNotification, deleteNotification, getNotifications, markAllAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createNotification);
router.route("/").get(isAuthenticated, getNotifications);
router.route("/:id").delete(isAuthenticated, deleteNotification);
router.route("/mark-all-read").patch(isAuthenticated, markAllAsRead);
router.route("/unread/count").get(isAuthenticated, countUnread);

export default router;