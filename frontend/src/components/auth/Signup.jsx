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
    const {loading, user} = useSelector(store=>store.auth);
    const [show, setShow] = useState({
        password: false,
        confirm: false
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const changeFileHandler = (e) => {
        setInput({...input, file: e.target.files?.[0]});
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("confirmPassword", input.confirmPassword);
        formData.append("role", input.role);

        if(input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });

            if(res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data?.message);
        } finally {
                dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if(user) {
            navigate("/");
        }
    }, []);
    useEffect(() => {
        setTimeout(() => {
            dispatch(stopLoading());
        }, 800)
    }, [dispatch]);

    return (
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-xl p-4 my-10">
                    <div className="w-8 h-8 mx-auto mb-4">
                        <img src="/logo.ico" alt="logo"/>
                    </div>
                    <h1 className="font-bold text-center text-xl text-[#003699] dark:text-gray-100 mb-5">Đăng ký tài khoản GeekJobs</h1>
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <Label htmlFor="fileInput" className="relative cursor-pointer">
                            <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                                {input.file ? (
                                    <img src={URL.createObjectURL(input.file)} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm text-gray-500"><CameraIcon className="w-4 h-4"/></span>
                                )}
                            </div>
                            <Input 
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="hidden dark:text-gray-100"
                            />
                        </Label>
                        <Label>Ảnh đại diện</Label>
                    </div>
                    <div className="my-2">
                        <Label>Họ và tên</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="VD: Nguyễn A"
                            className="rounded-xl dark:text-gray-700"
                        />
                    </div>
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="VD: abc123@gmail.com"
                            className="rounded-xl dark:text-gray-700"
                        />
                    </div>
                    <div className="my-2">
                        <Label>Số điện thoại</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="VD: 0123456789"
                            className="rounded-xl dark:text-gray-700"
                        />
                    </div>
                    <div className="my-2 relative">
                        <Label>Mật khẩu</Label>
                        <Input
                            type={show.password ? "text" : "password"}
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="VD: Abc2025@"
                            className="rounded-xl dark:text-gray-700 pr-10"
                        />
                        <div
                            className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            onClick={() => setShow(prev => ({ ...prev, password: !prev.password }))}
                        >
                            {show.password ? <EyeOff /> : <Eye />}
                        </div>
                    </div>
                    <div className="my-2 relative">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={show.confirm ? "text" : "password"}
                            value={input.confirmPassword}
                            onChange={changeEventHandler}
                            placeholder="VD: Abc2025@"
                            className="mt-2 pr-10 rounded-xl"
                            required
                        />
                        <span
                            className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                            onClick={() => setShow(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                            {show.confirm ? <EyeOff /> : <Eye />}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="Ứng viên"
                                    checked={input.role === 'Ứng viên'}
                                    onChange={changeEventHandler}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <Label htmlFor="r1">Ứng viên</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="Nhà tuyển dụng"
                                    checked={input.role === 'Nhà tuyển dụng'}
                                    onChange={changeEventHandler}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <Label htmlFor="r2">Nhà tuyển dụng</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading 
                        ? 
                        <Button className="w-full my-4 rounded-xl flex items-center justify-center"><Loader2 className="mr-2 w-4 h-4 animate-spin"/> Xin hãy đợi giây lát </Button> 
                        : 
                        <Button type="submit" className="w-full mt-6 text-white bg-blue-700 hover:bg-blue-500 rounded-xl px-6 py-2 font-medium">Đăng ký</Button>
                    }
                    <span className="text-sm">Bạn có thể đăng nhập ngay bây giờ? <Link to="/login" className="text-blue-600">Đăng nhập</Link></span>
                </form>
            </div>
    )
}

export default Signup;