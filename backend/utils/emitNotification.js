export const emitNotification = (io, onlineUsers, userId, notificationData) => {
  const sockets = onlineUsers.get(userId.toString());

  if (!sockets) return;

  if (sockets instanceof Set) {
    sockets.forEach(socketId => {
      io.to(socketId).emit("new_notification", notificationData);
    });
  } else {
    io.to(sockets).emit("new_notification", notificationData);
  }
};
