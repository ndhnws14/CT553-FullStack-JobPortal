import React, { useEffect, useState } from 'react';
import { Bookmark, CircleDollarSign, Clock, Heart, User2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utills/constant';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { startLoading } from '@/redux/uiSlice';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import DaysAgo from './DaysAgo';
import FormatApplyDate from './FormatApplyDate';

const JobByCompany = ({ job }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
  
    const [saved, setSaved] = useState(false);
    const [loved, setLoved] = useState(false);
  
    useEffect(() => {
      setSaved(user?.savedJobs?.includes(job._id));
      setLoved(user?.lovedJobs?.includes(job._id));
    }, [user, job._id]);

    const handleReloadNavigate = (path) => {
      dispatch(startLoading());
      window.location.href = path;
    };
  
    const toggleLove = async () => {
      try {
        const token = localStorage.getItem("token");
        const method = loved ? 'delete' : 'post';
        const url = `${USER_API_END_POINT}/${loved ? 'unlove' : 'love'}/${job._id}`;
        const res = await axios[method](url, loved ? {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        } : {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
  
        if (res.data.success) {
          const updatedLovedJobs = loved
            ? user.lovedJobs.filter(id => id !== job._id)
            : [...(user.lovedJobs || []), job._id];
          dispatch(setUser({ ...user, lovedJobs: updatedLovedJobs }));
          setLoved(!loved);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    };
  
    const saveJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${USER_API_END_POINT}/save/${job._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
  
        if (res.data.success) {
          dispatch(setUser({ ...user, savedJobs: [...(user.savedJobs || []), job._id] }));
          setSaved(true);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    };

    const daysLeft = DaysAgo(job.duration);
  
    return (
        <div 
          onClick={() => handleReloadNavigate(`/description/${job._id}`)}
          className='dark:text-gray-700 flex flex-col justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#F3F4F6] border hover:border-blue-300 shadow-sm hover:shadow-md transition cursor-pointer max-w-sm min-h-[140px]'
        >
            <div className='flex justify-between items-start mb-2'>
                <h2 className='text-lg font-bold text-gray-900'>{job.title}</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={24}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLove();
                      }}
                      disabled={!user || daysLeft <= 0}
                    >
                      <Heart className={`${loved ? 'fill-blue-800 stroke-blue-700' : 'stroke-blue-700'} transition`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{loved ? 'Bỏ yêu thích' : 'Yêu thích'}</TooltipContent>
                </Tooltip>
            </div>

            <div className="flex flex-wrap gap-2 text-blue-800 mb-2">
              {(job.requiredSkills || []).slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="outline" className='text-xs text-gray-700 px-2 py-1 bg-gray-100 border'>
                  {skill.name}
                </Badge>
              ))}
              {(job.requiredSkills?.length || 0) > 4 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-gray-600">+{job.requiredSkills.length - 3}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {job.requiredSkills.slice(3).map(skill => (
                      <span key={skill.name} className="block">{skill.name}</span>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>


            <div className='flex flex-wrap gap-2 my-3'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="ghost"
                    className="bg-blue-100 text-blue-700"
                  >
                    <User2 className='w-4 h-4 mr-1 shrink-0' />
                    {job.quantity} vị trí
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Số lượng tuyển dụng: {job.quantity}
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="ghost"
                    className="bg-rose-100 text-rose-700"
                  >
                    <CircleDollarSign className='w-4 h-4 mr-1 shrink-0' />
                    <span className="truncate max-w-[100px] inline-block align-middle">
                      {job?.salary}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Mức lương: {job.salary}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="border border-gray-300 my-1"></div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      saveJob();
                    }}
                    disabled={!user || saved || daysLeft <= 0}
                  >
                    <Bookmark className={`${saved ? 'fill-yellow-500 stroke-yellow-600' : 'stroke-yellow-600'} transition`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{saved ? 'Đã lưu' : 'Lưu lại'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center'>
                    <Clock className='w-4 h-4 mr-2' />
                    {daysLeft <= 0 ? 'Đã hết hạn tuyển' : `Còn ${DaysAgo(job.duration)} ngày`}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {`Ngày hết hạn nộp hồ sơ ${FormatApplyDate(job.duration)}`}
                </TooltipContent>
              </Tooltip>
            </div>
        </div>

    );
};

export default JobByCompany;
