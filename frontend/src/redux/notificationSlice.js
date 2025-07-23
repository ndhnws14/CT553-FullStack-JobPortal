import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload || [];
    },

    addNotification: (state, action) => {
      state.notifications = [action.payload, ...(state.notifications || [])];
    },
    markAllAsRead(state) {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
    },
    deleteNotificationById(state, action) {
      state.notifications = state.notifications.filter(n => n._id !== action.payload);
    },
  },
});

export const { setNotifications, addNotification, markAllAsRead, deleteNotificationById } = notificationSlice.actions;
export default notificationSlice.reducer;
