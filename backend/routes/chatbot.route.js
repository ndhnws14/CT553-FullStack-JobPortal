import express from "express";
import { postChatbot } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.route("/").post(postChatbot);

export default router;
