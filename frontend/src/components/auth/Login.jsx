import React, { useEffect, useState } from "react";
import { auth, provider, signInWithPopup } from "@/lib/firebase";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import { RadioGroup } from "../ui/radio-group.jsx";
import { Button } from "../ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utills/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice.js";
import { FcGoogle } from "react-icons/fc";
import FullPageLoader from "../loaders/FullPageLoader.jsx";
import { stopLoading } from "@/redux/uiSlice.js";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
        const [input, setInput] = useState({
            email: "",
            password: "",
            role: "",
        });
        const {loading, user} = useSelector(store=>store.auth);
        const [showPassword, setShowPassword] = useState(false);
        const navigate = useNavigate();
        const dispatch = useDispatch();
        
        const changeEventHandler = (e) => {
            setInput({...input, [e.target.name]: e.target.value});
        }

        const googleLoginHandler = async () => {
            try {
                dispatch(setLoading(true));
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                const idToken = await user.getIdToken();
        
                const res = await axios.post(`${USER_API_END_POINT}/login-google`, { credential: idToken },
                    { withCredentials: true }
                );
    
                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    navigate("/");
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.error("Lỗi khi đăng nhập Google:", error);
                toast.error("Đăng nhập Google thất bại!");
            } finally {
                dispatch(setLoading(false));
            }
        };
    
        const submitHandler = async (e) => {
            e.preventDefault();
            try {
                dispatch(setLoading(true));
                const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true,
                });
                if(res.data.success) {
                    await new Promise(r => setTimeout(r, 2000));
                    localStorage.setItem("token", res.data.token);
                    dispatch(setUser(res.data.user));
                    navigate("/");
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error);
                if (error.response) {
                    toast.error(error.response.data?.message || "Đã có lỗi xảy ra!");
                } else if (error.request) {
                    toast.error("Không nhận được phản hồi từ server!");
                } else {
                    toast.error("Lỗi không xác định: " + error.message);
                }
            } finally {
                dispatch(setLoading(false));
            }
        }
        useEffect(() => {
            if(user) {
                navigate("/");
            }
        }, [user]);
        useEffect(() => {
            setTimeout(() => {
                dispatch(stopLoading());
            }, 800)
        }, [dispatch]);
    return (
        <div className="relative">
            { loading && <FullPageLoader /> }
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-xl p-4 my-10">
                    <div className="w-8 h-8 mx-auto mb-4">
                        <img src="/logo.ico" alt="logo"/>
                    </div>
                    <h1 className="font-bold text-center text-xl text-[#003699] dark:text-gray-100 mb-5">Đăng nhập vào GeekJobs</h1>
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
                    <div className="my-2 relative">
                        <Label>Mật khẩu</Label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="VD: Abc2025@"
                            className="rounded-xl dark:text-gray-700 pr-10"
                        />
                        <div
                            className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </div>
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
                    <Button type="submit" className="w-full mt-6 text-white bg-blue-700 hover:bg-blue-500 rounded-xl px-6 py-2 font-medium">Đăng nhập</Button>
                    <div className="flex flex-col items-center my-5">
                        <Button
                            type="button"
                            onClick={googleLoginHandler}
                            disabled={loading}
                            variant="outline"
                            className="w-full rounded-xl flex items-center justify-center gap-2 py-2"
                        >
                            <FcGoogle className="w-5 h-5" />
                            Đăng nhập bằng Google
                        </Button>
                    </div>
                    <div className="text-sm text-center">
                        <span>Bạn chưa có tài khoản để đăng nhập? <Link to="/register" className="text-blue-600">Đăng ký</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;