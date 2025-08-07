import React, { useEffect, useState } from 'react';
import { Contact, Mail, Pen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from '../ui/avatar.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import AppliedJobTable from './AppliedJobTable.jsx';
import UpdateProfileDialog from './UpdateProfileDialog.jsx';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs.jsx';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '../ui/alert.jsx';
import axios from 'axios';
import { LEVEL_API_END_POINT, TECHSKILL_API_END_POINT } from '@/utills/constant.js';
import { stopLoading } from '@/redux/uiSlice.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip.jsx';
import UserLevelSummary from '../UserLevelSummary.jsx';

const Profile = () => {
    useGetAppliedJobs();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [allSkills, setAllSkills] = useState([]);
    const [levels, setLevels] = useState([]);

    const isProfileIncomplete = !user?.profile?.bio ||
        !user?.profile?.skills || user?.profile?.skills.length === 0 || !user?.profile?.github;

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get(`${TECHSKILL_API_END_POINT}/skills?limit=100`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAllSkills(res.data.skills);
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách kỹ năng:", err);
            }
        };
        fetchSkills();
    }, []);

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const res = await axios.get(`${LEVEL_API_END_POINT}/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setLevels(res.data.levels);
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách level:", err);
            }
        };
        fetchLevels();
    }, []);
    const userLevel = levels.find(lv => lv._id === (typeof user?.profile?.level === 'object' ? user.profile.level._id : user?.profile?.level));
   
    useEffect(() => {
        setTimeout(() => {
            dispatch(stopLoading());
        }, 800)
    }, [dispatch]);

    const getLevelClass = (levelName) => {
        switch (levelName) {
            case 'Intern':
                return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md';
            case 'Fresher':
                return 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md';
            case 'Junior':
                    return 'bg-gradient-to-r from-blue-400 to-blue-700 text-white shadow-md';
            case 'Middle':
                return 'bg-gradient-to-r from-yellow-300 to-yellow-600 text-black shadow-md';
            case 'Senior':
                return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md';
            default:
                return 'bg-gray-300 text-black';
        }
    };
    const levelClass = getLevelClass(userLevel?.name);

    return (
        <div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 dark:text-gray-700 rounded-xl my-5 p-8 shadow-sm'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-start gap-6 w-full'>
                        <Avatar className="h-28 w-28 border border-gray-500">
                            <AvatarImage src={user?.profile?.profilePhoto ?? "/assets/avatar.jpg"} alt={user?.fullname || "Avatar"} />
                        </Avatar>

                        <div className="flex flex-col sm:flex-row justify-between w-full">
                            <div className="sm:w-2/3">
                                <h1 className='font-bold text-2xl mb-1'>{user?.fullname || "Người dùng"}</h1>
                                <div className='flex items-center flex-wrap'>
                                    <p className="text-gray-600 text-sm">
                                        {user?.profile?.bio || "Chưa có thông tin giới thiệu. Hãy thêm vào để nhà tuyển dụng hiểu hơn về bạn."}
                                    </p>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span
                                                type="button"
                                                className={`ml-2 text-sm font-medium px-3 py-1 rounded-full cursor-pointer ${levelClass}`}
                                            >
                                                {userLevel?.name || 'Chưa cập nhật'}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <UserLevelSummary level={userLevel} />
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        className="rounded-full w-10 h-10 p-0 ml-4 text-gray-600 hover:bg-gray-200"
                        variant="outline"
                        title="Chỉnh sửa hồ sơ"
                    >
                        <Pen size={18} />
                    </Button>
                </div>

                <div className='my-6 border-t pt-6'>
                    <h2 className='text-lg font-bold mb-3'>Thông tin liên hệ</h2>
                    <div className='flex items-center gap-3 my-2 text-gray-700'>
                        <Mail size={18} />
                        <span>{user?.email || "Chưa có Email"}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2 text-gray-700'>
                        <Contact size={18} />
                        <span>{user?.phoneNumber || "Chưa có Số điện thoại"}</span>
                    </div>
                </div>

                <div className='my-6 border-t pt-6'>
                    <h2 className='text-lg font-bold mb-3'>Kỹ năng</h2>
                    <div className='flex flex-wrap items-center gap-2'>
                        {
                            user?.profile?.skills && user.profile.skills.length > 0 ?
                                user.profile.skills.map((item, index) => {
                                    const skillObj = allSkills.find(skill => skill._id === item.skill);
                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <Badge
                                                    className="bg-[#003699] hover:bg-[#709ff5] text-white font-normal px-3 py-1 rounded-full cursor-pointer"
                                                >
                                                    {skillObj?.name || "Không xác định"}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Mức độ thành thạo: {item.proficiency}</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }) :
                                <span className="text-gray-500 text-sm">
                                    Chưa có kỹ năng nào được thêm. <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setOpen(true)}>Thêm kỹ năng</span>
                                </span>
                        }
                    </div>
                </div>

                <div className='my-6 border-t pt-6'>
                    <h2 className='text-lg font-bold mb-3'>Hồ sơ cá nhân (CV)</h2>
                    <div className='grid w-full items-center gap-1.5'>
                        {
                            user?.cvId ? (
                                <Link
                                    to={`/my-cv/${user?.cvId}`}
                                    className="text-blue-600 hover:underline cursor-pointer truncate"
                                >
                                    CV - {user.fullname}
                                </Link>
                            ) : (
                                <span className="text-gray-500 text-sm">
                                    Chưa có hồ sơ cá nhân (CV). <Link to='/create-cv' className="text-blue-600 cursor-pointer hover:underline">Tạo hồ sơ (CV).</Link>
                                </span>
                            )
                        }
                    </div>
                </div>

                <div className='my-6 border-t pt-6'>
                    <h2 className='text-lg font-bold mb-3'>Github</h2>
                    <div className='grid w-full items-center gap-1.5'>
                        {
                            user?.profile?.github && user.profile.github !== "" ? (
                                <Link
                                    to={user.profile.github}
                                    target="_blank"
                                    className="text-blue-600 hover:underline cursor-pointer truncate"
                                >
                                    Github {user.fullname}
                                </Link>
                            ) : (
                                <span className="text-gray-500 text-sm">
                                    Chưa có link Github. <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setOpen(true)}>Thêm link Github</span>
                                </span>
                            )
                        }
                    </div>
                </div>

                {isProfileIncomplete && (
                    <Alert className="mt-6 bg-yellow-50 border-yellow-200 text-yellow-800">
                        <AlertDescription className="text-sm">
                            Hồ sơ của bạn chưa hoàn chỉnh. Hãy <span className="text-blue-600 cursor-pointer font-semibold hover:underline" onClick={() => setOpen(true)}>cập nhật hồ sơ</span> để tăng cơ hội ứng tuyển thành công!
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className='max-w-4xl mx-auto bg-white rounded-xl my-5 p-8 shadow-md'>
                <h1 className="text-xl font-bold mb-5">Các công việc đã ứng tuyển</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} className='bg-white' />
        </div>
    );
}

export default Profile;