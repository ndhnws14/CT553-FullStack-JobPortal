import { setUser } from '@/redux/authSlice';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { USER_API_END_POINT } from '@/utills/constant';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [input, setInput] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false
    });


    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.oldPassword || !input.newPassword || !input.confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ các trường!");
            return;
        }

        if (input.newPassword !== input.confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
                oldPassword: input.oldPassword,
                newPassword: input.newPassword,
                confirmPassword: input.confirmPassword
            }, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setInput({ oldPassword: "", newPassword: "", confirmPassword: "" });
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    if (user?.googleId) {
        return (
            <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-md text-center dark:text-gray-700">
                <h2 className="text-2xl font-bold mb-4">Đổi mật khẩu</h2>
                <p className="text-gray-600">Tài khoản đăng nhập bằng Google không thể thay đổi mật khẩu.</p>
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto p-6 my-6 bg-white rounded-xl shadow-md dark:text-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mật khẩu cũ */}
                <div className="relative">
                    <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                    <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={show.old ? "text" : "password"}
                        value={input.oldPassword}
                        onChange={handleChange}
                        className="mt-2 pr-10 rounded"
                        required
                    />
                    <span
                        className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                        onClick={() => setShow(prev => ({ ...prev, old: !prev.old }))}
                    >
                        {show.old ? <EyeOff /> : <Eye />}
                    </span>
                </div>

                {/* Mật khẩu mới */}
                <div className="relative">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type={show.new ? "text" : "password"}
                        value={input.newPassword}
                        onChange={handleChange}
                        className="mt-2 pr-10 rounded"
                        required
                    />
                    <span
                        className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                        onClick={() => setShow(prev => ({ ...prev, new: !prev.new }))}
                    >
                        {show.new ? <EyeOff /> : <Eye />}
                    </span>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div className="relative">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={show.confirm ? "text" : "password"}
                        value={input.confirmPassword}
                        onChange={handleChange}
                        className="mt-2 pr-10 rounded"
                        required
                    />
                    <span
                        className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                        onClick={() => setShow(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                        {show.confirm ? <EyeOff /> : <Eye />}
                    </span>
                </div>
                <Button 
                    type="submit" 
                    className="w-full mt-4 bg-blue-700 hover:bg-blue-500 text-white rounded-xl py-2"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Đang cập nhật...
                        </div>
                    ) : (
                        "Cập nhật mật khẩu"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword;
