import {
  User2,
  FileIcon,
  Heart,
  Bookmark,
  Lock,
  LogOut,
  Moon,
  ChartColumnStacked
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import DarkModeToggle from "../DarkModeToggle";

const UserMenu = ({ user, logoutHandler, mobile = false }) => {
  return (
    <div className={`flex flex-col ${mobile ? "gap-3 mt-4 text-white" : "text-gray-600"} w-full`}>
      {user?.role === "Ứng viên" ? (
        <>
          <Link to="/profile"><Button variant="link" className="flex items-center gap-2"><User2 size={18} /> Trang cá nhân</Button></Link>
          <Link to={`/my-cv/${user?.cvId}`}><Button variant="link" className="flex items-center gap-2"><FileIcon size={18} /> Hồ sơ & CV</Button></Link>
          <Link to="/loved-jobs"><Button variant="link" className="flex items-center gap-2"><Heart size={18} /> Công việc yêu thích</Button></Link>
          <Link to="/saved-jobs"><Button variant="link" className="flex items-center gap-2"><Bookmark size={18} /> Công việc đã lưu</Button></Link>
          <Link to="/reset-password"><Button variant="link" className="flex items-center gap-2"><Lock size={18} /> Đổi mật khẩu</Button></Link>
        </>
      ) : (
        <>
          <Link to="/recruiter/profile"><Button variant="link" className="flex items-center gap-2"><User2 size={18} /> Quản lý tài khoản</Button></Link>
          <Link to="/recruiter/statistics"><Button variant="link" className="flex items-center gap-2"><ChartColumnStacked size={18} /> Thống kê</Button></Link>
          <Link to="/reset-password"><Button variant="link" className="flex items-center gap-2"><Lock size={18} /> Đổi mật khẩu</Button></Link>
        </>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 ml-4">
          <Moon size={18} />
          <span className="text-sm font-medium">Giao diện</span>
        </div>
        <DarkModeToggle />
      </div>
      <Button
        onClick={logoutHandler}
        variant="link"
        className="text-red-500 flex gap-2 items-center justify-start pl-4"
      >
        <LogOut size={18} /> Đăng xuất
      </Button>
    </div>
  );
};

export default UserMenu;
