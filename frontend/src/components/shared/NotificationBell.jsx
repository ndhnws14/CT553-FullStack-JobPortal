import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover.jsx";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList.jsx";

const NotificationBell = ({ user, unreadCount, onMarkAllRead }) => {
  const [open, setOpen] = useState(false);

  const handleBellClick = () => {
    if (!user) return;
    setOpen(prev => !prev);
  };

  return (
    <div className="border border-blue-500 hover:bg-blue-500 rounded-full p-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer" onClick={handleBellClick}>
            <Bell className="w-5 h-5 text-white" />
            {user && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white mt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-lg">Thông báo</h4>
            {unreadCount > 0 && (
              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={onMarkAllRead}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <NotificationList user={user} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationBell;
