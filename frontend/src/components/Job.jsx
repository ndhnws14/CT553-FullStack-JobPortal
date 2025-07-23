import React, { useEffect, useState } from 'react';
import { Bookmark, CircleDollarSign, Clock, Heart, MapPin, User2 } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utills/constant';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import FormatApplyDate from './FormatApplyDate';
import DaysAgo from './DaysAgo';
import { startLoading } from '@/redux/uiSlice';

const Job = ({ job }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  const [saved, setSaved] = useState(false);
  const [loved, setLoved] = useState(false);

  const savedJobs = user?.savedJobs || [];
  const lovedJobs = user?.lovedJobs || [];

  useEffect(() => {
    setSaved(savedJobs.includes(job._id));
    setLoved(lovedJobs.includes(job._id));
  }, [savedJobs, lovedJobs, job._id]);

  const handleReloadNavigate = (path) => {
    dispatch(startLoading());
    window.location.href = path;
  };

  const toggleLove = async () => {
    const token = localStorage.getItem("token");
    const action = loved ? 'unlove' : 'love';
    const method = loved ? 'delete' : 'post';

    try {
      const url = `${USER_API_END_POINT}/${action}/${job._id}`;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      const res = await axios[method](url, method === 'post' ? {} : config, config);

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
  const isExpired = daysLeft <= 0;

  return (
    <div
      onClick={!isExpired ? () => handleReloadNavigate(`/description/${job._id}`) : undefined}
      className={`h-full flex flex-col p-3 rounded-xl 
        ${isExpired ? 'bg-gray-200 cursor-not-allowed opacity-70' : 'bg-gray-50 hover:shadow-xl hover:border-blue-300 cursor-pointer'} 
        dark:bg-[#F3F4F6] dark:text-gray-700 border shadow-md transition`
      }
    >
      <div className='flex justify-between items-start mt-2'>
        <div className='flex gap-3'>
          <Avatar className="w-14 h-14 ring-1 ring-blue-200 rounded-xl">
            <AvatarImage src={job.company?.logo} />
          </Avatar>
          <div>
            <h1 className='font-semibold text-base truncate w-[120px]'>{job.company?.abbreviationName}</h1>
            <p className='text-sm text-gray-500 flex items-center gap-1'>
              <MapPin className='w-4 h-4' /> {job.company?.location}
            </p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={24}
              onClick={(e) => {
                e.stopPropagation();
                toggleLove();
              }}
              disabled={!user || isExpired}
            >
              <Heart className={`${loved ? 'fill-blue-800 stroke-blue-700' : 'stroke-blue-700'} transition`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{loved ? 'Bỏ yêu thích' : 'Yêu thích'}</TooltipContent>
        </Tooltip>
      </div>

      <div className='my-3 flex flex-col gap-2'>
        <h2 className='text-lg font-bold text-gray-900'>{job.title}</h2>
        <div className="flex flex-wrap gap-2">
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
      </div>

      <div className='flex items-center justify-between flex-wrap gap-3 mt-auto'>
        <div className='flex flex-wrap gap-2 text-sm'>
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
                <span className="truncate max-w-[90px] inline-block align-middle">
                  {job?.salary}
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Mức lương: {job.salary}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="border border-gray-300 my-2"></div>

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
              disabled={!user || saved || isExpired}
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
              {isExpired ? 'Đã hết hạn tuyển' : `Còn ${DaysAgo(job.duration)} ngày`}
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

export default Job;
