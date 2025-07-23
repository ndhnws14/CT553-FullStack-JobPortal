import React from 'react';
import { CircleDollarSign, Clock, User2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip.jsx';
import FormatApplyDate from '../FormatApplyDate.jsx';
import { Badge } from '../ui/badge.jsx';
import { useDispatch } from 'react-redux';
import { startLoading } from '@/redux/uiSlice.js';

const LastestJobCards = ({ job }) => {
  const dispatch = useDispatch();

  const daysAgo = (date) => {
    const diff = new Date() - new Date(date);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleReloadNavigate = (path) => {
     dispatch(startLoading());
     window.location.href = path;
  };

  return (
    <div className='relative'>
      {/* Góc trái hoặc phải - tag "Mới" */}
      <div className="absolute top-1 right-1 z-10 animate-bounce">
        <span className="bg-[#F97316] text-white text-xs font-extrabold px-2 py-1 rounded shadow-sm">
          NEW
        </span>
      </div>
      <div
        onClick={() => handleReloadNavigate(`/description/${job?._id}`)}
        className="p-5 mt-3 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group "
      >

        {/* Header */}
        <div className="flex justify-between items-start mt-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800 group-hover:text-blue-700">{job?.company?.abbreviationName}</h2>
            <p className="text-sm text-gray-500">{job?.company?.location}</p>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            {daysAgo(job.createdAt) == 0 ? `Hôm nay` : `${daysAgo(job.createdAt)} ngày trước`}
          </div>
        </div>

        {/* Title & Skills */}
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

        {/* Info badges */}
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
    </div>
  );
};

export default LastestJobCards;
