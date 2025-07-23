import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from 'socket.io';

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import cvRoute from "./routes/cv.route.js";
import techskillRoute from "./routes/techskill.route.js";
import levelRoute from "./routes/level.route.js";
import notificationRoute from "./routes/notification.route.js";
import statisticsRoute from "./routes/statistics.route.js";
import recommendRoute from "./routes/recommend.route.js";
import chatbotRoute from "./routes/chatbot.route.js";
dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo Socket.IO server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Map lưu userId -> socketId
const onlineUsers = new Map();

// Sự kiện khi client kết nối
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Client gửi userId sau khi đăng nhập
  socket.on('register', (userId) => {
    const existing = onlineUsers.get(userId) || new Set();
    existing.add(socket.id);
    onlineUsers.set(userId, existing);
  });

  // Ngắt kết nối
  socket.on('disconnect', () => {
    for (let [userId, sockets] of onlineUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) onlineUsers.delete(userId);
    }
  });
});

// Truyền io và onlineUsers vào app để các controller dùng được
app.set('io', io);
app.set('onlineUsers', onlineUsers);

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/cv", cvRoute);
app.use("/api/v1/tech-skill", techskillRoute);
app.use("/api/v1/level", levelRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/statistics", statisticsRoute);
app.use("/api/v1/recommend", recommendRoute);
app.use("/api/v1/chatbot", chatbotRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    connectDB();
    console.log(`Server running port ${PORT}`);
})