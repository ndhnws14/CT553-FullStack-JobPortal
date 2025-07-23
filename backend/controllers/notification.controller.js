import { Notification } from "../models/notification.model.js";

export const createNotification = async (req, res) => {
    try {
        const { recipient, sender, type, message, relatedJob } = req.body;

        const notification = await Notification.create({
            recipient,
            sender,
            type,
            message,
            relatedJob
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "fullname")
            .populate("relatedJob", "title")

        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers");
        const socketId = onlineUsers.get(recipient.toString());

        if (socketId && io) {
            io.to(socketId).emit("new_notification", populatedNotification);
        }

        return res.status(201).json({
            message: "Bạn có một thông báo mới.",
            success: true,
            notification: populatedNotification
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi.",
            success: false,
            error: error.message
        });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ recipient: userId })
            .populate("sender", "fullnamename")
            .populate("relatedJob", "title")
            .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi.", success: false });
  }
};

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ message: 'Không tìm thấy thông báo.' });
        };

        return res.status(200).json({
            message: "Đã xóa thông báo thành công.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi.",
            success: false,
            error: error.message
        });
    }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'Tất cả thông báo đã được đánh dấu là đã đọc.',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi.",
      success: false,
      error: error.message
    });
  }
};

export const countUnread = async (req, res) => {
    try {
        const userId = req.id;
        const count = await Notification.countDocuments({ recipient: userId, isRead: false });

        return res.status(200).json({ success: true, count });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};