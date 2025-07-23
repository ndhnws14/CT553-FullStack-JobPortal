import React from 'react';
import { Badge } from '../ui/badge';
import { CircleDollarSign, Clock, User2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import FormatApplyDate from '../FormatApplyDate';
import { useDispatch } from 'react-redux';
import { startLoading } from '@/redux/uiSlice';

const UrgentJobCards = ({job}) => {
  const dispatch = useDispatch();

  const daysDeadline = (date) => {
    const diff = new Date(date) - new Date();
    return Math.floor((diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleReloadNavigate = (path) => {
    dispatch(startLoading());
    window.location.href = path;
  };
  
    return (
      <div 
        onClick={() => handleReloadNavigate(`/description/${job?._id}`)} 
        className="p-5 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold text-gray-800 group-hover:text-blue-700">{job?.company?.abbreviationName}</h2>
            <p className="text-sm text-gray-500">{job?.company?.location}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {daysDeadline(job.duration) <= 0 ? 'Đã hết hạn tuyển' : `Còn ${daysDeadline(job.duration)} ngày`}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {`Ngày hết hạn nộp hồ sơ: ${FormatApplyDate(job.duration)}`}
            </TooltipContent>
          </Tooltip>
        </div>
  
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job?.title}</h3>
          <div className="flex flex-wrap gap-2 my-2">
            {(job.requiredSkills || []).slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="outline" className='text-xs text-gray-800 px-2 py-1 bg-gray-50 border'>
                {skill.name}
              </Badge>
            ))}
            {(job.requiredSkills?.length || 0) > 4 && (
              <span className="text-sm text-gray-600">+{job.requiredSkills.length - 4}</span>
            )}
          </div>
        </div>
  
        <div className="flex flex-wrap gap-2">
          <Badge variant="ghost" className="bg-blue-100 text-blue-700">
            <User2 className="w-4 h-4 mr-1" />
            {job?.quantity} Vị trí
          </Badge>
          <Badge variant="ghost" className="bg-rose-100 text-rose-700">
            <Clock className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[100px] inline-block align-middle">
              {job?.jobType}
            </span>
          </Badge>
          <Badge variant="ghost" className="bg-violet-100 text-violet-700">
            <CircleDollarSign className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[70px] inline-block align-middle">
              {job?.salary}
            </span>
          </Badge>
        </div>
      </div>
    );
}

export default UrgentJobCards;