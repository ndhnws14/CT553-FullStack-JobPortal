import React, { useEffect, useState } from "react";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import { RadioGroup } from "../ui/radio-group.jsx";
import { Button } from "../ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utills/constant.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice.js";
import { CameraIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { stopLoading } from "@/redux/uiSlice.js";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    file: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const [show, setShow] = useState({ password: false, confirm: false });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (key !== "file") {
        formData.append(key, input[key]);
      }
    });
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  useEffect(() => {
    setTimeout(() => dispatch(stopLoading()), 800);
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <form
        onSubmit={submitHandler}
        className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-[460px] border border-gray-200 rounded-xl p-6 shadow-lg bg-white"
      >
        <div className="w-10 h-10 mx-auto mb-4">
          <img src="/logo.ico" alt="logo" />
        </div>

        <h1 className="font-bold text-center text-xl text-blue-800 mb-5">
          Đăng ký tài khoản GeekJobs
        </h1>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Label htmlFor="fileInput" className="relative cursor-pointer">
            <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
              {input.file ? (
                <img
                  src={URL.createObjectURL(input.file)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <CameraIcon className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <Input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="hidden"
            />
          </Label>
          <Label>Ảnh đại diện</Label>
        </div>

        {/* Họ và tên */}
        <div className="mb-3">
          <Label>Họ và tên</Label>
          <Input
            type="text"
            name="fullname"
            value={input.fullname}
            onChange={changeEventHandler}
            placeholder="VD: Nguyễn A"
            className="rounded-xl dark:text-gray-700"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="VD: abc123@gmail.com"
            className="rounded-xl dark:text-gray-700"
          />
        </div>

        {/* Số điện thoại */}
        <div className="mb-3">
          <Label>Số điện thoại</Label>
          <Input
            type="text"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeEventHandler}
            placeholder="VD: 0123456789"
            className="rounded-xl dark:text-gray-700"
          />
        </div>

        {/* Mật khẩu */}
        <div className="mb-3 relative">
          <Label>Mật khẩu</Label>
          <Input
            type={show.password ? "text" : "password"}
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="VD: Abc2025@"
            className="rounded-xl pr-10 dark:text-gray-700"
          />
          <div
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() =>
              setShow((prev) => ({ ...prev, password: !prev.password }))
            }
          >
            {show.password ? <EyeOff /> : <Eye />}
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="mb-3 relative">
          <Label>Xác nhận mật khẩu</Label>
          <Input
            type={show.confirm ? "text" : "password"}
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={changeEventHandler}
            placeholder="Nhập lại mật khẩu"
            className="rounded-xl pr-10 dark:text-gray-700"
          />
          <div
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() =>
              setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
          >
            {show.confirm ? <EyeOff /> : <Eye />}
          </div>
        </div>

        {/* Radio Vai trò */}
        <RadioGroup className="flex flex-col sm:flex-row gap-4 my-4">
          <div className="flex items-center space-x-2">
            <Input
              type="radio"
              name="role"
              value="Ứng viên"
              checked={input.role === "Ứng viên"}
              onChange={changeEventHandler}
              className="w-4 h-4"
            />
            <Label>Ứng viên</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="radio"
              name="role"
              value="Nhà tuyển dụng"
              checked={input.role === "Nhà tuyển dụng"}
              onChange={changeEventHandler}
              className="w-4 h-4"
            />
            <Label>Nhà tuyển dụng</Label>
          </div>
        </RadioGroup>

        {/* Nút đăng ký */}
        {loading ? (
          <Button
            disabled
            className="w-full my-4 rounded-xl flex items-center justify-center"
          >
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Xin hãy đợi giây lát
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full my-4 text-white bg-blue-700 hover:bg-blue-600 rounded-xl px-6 py-2 font-medium"
          >
            Đăng ký
          </Button>
        )}

        {/* Link đăng nhập */}
        <p className="text-sm text-center">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
