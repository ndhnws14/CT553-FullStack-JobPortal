import React, { useState } from "react";
import {
  Users, Building2, FileText, BarChart2, Code, LogOut, Star, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "@/utills/constant";
import { toast } from "sonner";

const sidebarItems = [
  { name: "Công nghệ - Kỹ năng", icon: <Code className="w-5 h-5" />, path: "/admin/skills" },
  { name: "Trình độ IT", icon: <Star className="w-5 h-5" />, path: "/admin/level" },
  { name: "Quản lý tài khoản", icon: <Users className="w-5 h-5" />, path: "/admin/accounts" },
  { name: "Quản lý công ty", icon: <Building2 className="w-5 h-5" />, path: "/admin/companies" },
  { name: "Quản lý bài đăng", icon: <FileText className="w-5 h-5" />, path: "/admin/posts" },
  { name: "Thống kê", icon: <BarChart2 className="w-5 h-5" />, path: "/admin/stats" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đăng xuất");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="sm:hidden fixed top-1 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white bg-[#003699] p-2 rounded">
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={
          `fixed top-0 left-0 min-h-screen bg-[#003699] w-64 text-white flex flex-col px-4 py-6 z-40 transition-transform duration-300 ` +
          `${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative`
        }
      >
        <div className="text-xl font-bold text-center mb-6">
          <Link to="/admin">Quản Trị Viên</Link>
        </div>

        <hr className="border-white/30 mb-4" />

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <Link key={index} to={item.path}>
              <Button
                variant="ghost"
                className={
                  `w-full justify-start text-base font-medium px-3 py-2 rounded-xl transition ` +
                  (location.pathname === item.path
                    ? "bg-white hover:bg-blue-500 text-blue-900"
                    : "text-white hover:bg-blue-500")
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/20 mt-auto">
          <Button
            variant="ghost"
            onClick={logoutHandler}
            className="w-full justify-start text-base font-medium px-3 py-2 rounded-xl text-white hover:bg-red-500 transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
