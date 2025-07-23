import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { RECOMMEND_API_END_POINT } from '@/utills/constant';
import Job from './Job';
import JobSkeletonCard from './loaders/JobSkeletonCard';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const RecommendByUserBehavior = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [hasBehaviorData, setHasBehaviorData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true); // 👈 Thêm state này

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${RECOMMEND_API_END_POINT}/collab/${user?._id}`, {
          withCredentials: true
        });

        if (res.data && res.data.length > 0) {
          setJobs(res.data);
          setHasBehaviorData(true);
        }
      } catch (err) {
        console.error("Lỗi khi lấy gợi ý kết hợp:", err);
        setHasBehaviorData(false);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?._id]);

  if (!hasBehaviorData || !isVisible) return null;

  return (
    <div className="max-w-7xl mx-auto pt-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          animate={{ y: [0, -10, 0] }}
          transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
          }}
          className="text-xl font-bold text-blue-700"
        >
          Đừng bỏ lỡ những công việc này!
        </motion.h2>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-red-500 text-lg font-bold px-2"
            >
              <X />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Ẩn gợi ý
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {loading
          ? [...Array(8)].map((_, idx) => <JobSkeletonCard key={idx} />)
          : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="h-full flex flex-col">
                  <Job job={job} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">Không có gợi ý nào.</div>
            )}
      </div>
    </div>
  );
};

export default RecommendByUserBehavior;
