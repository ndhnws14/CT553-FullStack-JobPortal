import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.jsx";
import { Avatar, AvatarImage } from "../ui/avatar.jsx";
import { Button } from "../ui/button.jsx";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { NOTIFICATION_API_END_POINT, USER_API_END_POINT } from "@/utills/constant.js";
import { setLoading, setUser } from "@/redux/authSlice.js";
import { markAllAsRead } from "@/redux/notificationSlice.js";
import NotificationBell from "./NotificationBell.jsx";
import CreateCVButton from "./CreateCVButton.jsx";
import FullPageLoader from "../loaders/FullPageLoader.jsx";
import { startLoading} from "@/redux/uiSlice.js";
import UserMenu from "./UserMenu.jsx";

const Navbar = () => {
  const { user, loading } = useSelector((store) => store.auth);
  const unreadCount = useSelector(
    (state) => state.notification.notifications.filter((n) => !n.isRead).length
  );
  const [open, setOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleReloadNavigate = (path) => {
    dispatch(startLoading());
    window.location.href = path;
  };

  const markAllAsReadHandler = async () => {
    try {
      const res = await axios.patch(`${NOTIFICATION_API_END_POINT}/mark-all-read`, {}, { withCredentials: true });
      if (res.data.success) {
        dispatch(markAllAsRead());
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const logoutHandler = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });

      if (res.data.success) {
        await new Promise((r) => setTimeout(r, 2000));
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đã xảy ra lỗi khi đăng xuất.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderNavItem = (label, path) => (
    <li
      key={path}
      className={`px-2 py-1 cursor-pointer ${
        location.pathname === path
          ? "text-orange-400 font-semibold"
          : "hover:text-orange-300 text-white"
      }`}
      onClick={() => {
        setOpen(false);
        handleReloadNavigate(path);
      }}
    >
      {label}
    </li>
  );

  return (
    <>
        {loading && <FullPageLoader />}
        <div className="sticky top-0 z-50 bg-[#003699] dark:bg-[#252728] transition-colors shadow-md">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleReloadNavigate("/")}>
                <img src="/logo.ico" alt="Logo" className="h-8 w-8 object-contain" />
                <h1 className="text-2xl text-white font-bold">
                    Geek<span className="text-blue-500">Jobs</span>
                </h1>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
                {/* Thông báo & Tạo CV hiển thị ở ngoài menu trên mobile */}
                {user?.role !== "Nhà tuyển dụng" && <CreateCVButton />}
                <NotificationBell user={user} unreadCount={unreadCount} onMarkAllRead={markAllAsReadHandler} />

                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-6">
                <ul className="flex items-center gap-4 font-medium">
                {user?.role === "Nhà tuyển dụng" ? (
                    <>
                        {renderNavItem("Công ty", "/recruiter/companies")}
                        {renderNavItem("Đăng tin việc làm", "/recruiter/jobs")}
                    </>
                ) : (
                    <>
                        {renderNavItem("Cơ hội việc làm", "/jobs")}
                        {renderNavItem("Công ty", "/companies")}
                        {renderNavItem("Cẩm nang nghề nghiệp", "/guide")}
                        <CreateCVButton />
                    </>
                )}
                    <NotificationBell user={user} unreadCount={unreadCount} onMarkAllRead={markAllAsReadHandler} />
                </ul>

                {!user ? (
                <div className="flex items-center gap-2">
                    <span onClick={() => handleReloadNavigate("/login")}>
                        <Button className="rounded-xl text-white bg-blue-700 hover:bg-blue-500">Đăng nhập</Button>
                    </span>
                    <span onClick={() => handleReloadNavigate("/register")}>
                        <Button variant="outline" className="text-[#005aff] hover:text-white bg-white hover:bg-[#709ff5] rounded-xl">Đăng ký</Button>
                    </span>
                </div>
                ) : (
                    <div className="hidden sm:block">
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Avatar className="border border-gray-500 cursor-pointer">
                            <AvatarImage src={user?.profile?.profilePhoto || "/assets/avatar.jpg"} alt={user?.fullname} />
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white">
                            <div className="flex gap-4 mb-4">
                            <Avatar className="border border-gray-500">
                                <AvatarImage src={user?.profile?.profilePhoto || "/assets/avatar.jpg"} alt={user?.fullname} />
                            </Avatar>
                            <h4 className="font-medium">{user?.fullname}</h4>
                            </div>
                            <UserMenu user={user} logoutHandler={logoutHandler} mobile={false} />
                        </PopoverContent>
                        </Popover>
                    </div>
                )}
                </div>
            </div>

            {/* Mobile nav */}
            {mobileMenuOpen  && (
            <div className="md:hidden px-4 pb-4 bg-[#003699] dark:bg-[#252728] text-white">
                <ul className="flex flex-col gap-3 ml-2 font-medium">
                    {user?.role === "Nhà tuyển dụng" ? (
                        <>
                        {renderNavItem("Công ty", "/recruiter/companies")}
                        {renderNavItem("Đăng tin việc làm", "/recruiter/jobs")}
                        </>
                    ) : (
                        <>
                        {renderNavItem("Cơ hội việc làm", "/jobs")}
                        {renderNavItem("Công ty", "/companies")}
                        {renderNavItem("Cẩm nang nghề nghiệp", "/guide")}
                        </>
                    )}
                </ul>
                <div className="mt-4">
                    {!user ? (
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => handleReloadNavigate("/login")} className="bg-blue-700 hover:bg-blue-500 text-white w-full">Đăng nhập</Button>
                            <Button onClick={() => handleReloadNavigate("/register")} variant="outline" className="bg-white text-[#005aff] hover:bg-[#709ff5] w-full">Đăng ký</Button>
                        </div>
                    ) : (
                        <UserMenu user={user} logoutHandler={logoutHandler} mobile />
                    )}
                </div>
            </div>
            )}
        </div>
    </>
  );
};

export default Navbar;