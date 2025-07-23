import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RECOMMEND_API_END_POINT } from '@/utills/constant';
import Job from './Job';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/uiSlice';
import JobSkeletonCard from './loaders/JobSkeletonCard';

const RecommendSimilarJobs = ({ jobId }) => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      dispatch(startLoading());
      try {
        const res = await axios.get(`${RECOMMEND_API_END_POINT}/similar-job/${jobId}`);
        setJobs(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy gợi ý công việc:', err);
      } finally {
        dispatch(stopLoading());
        setLoading(false);
      }
    };
    fetchSimilarJobs();
  }, [jobId]);

  return (
    <div className="m-4">
      <h1 className="font-medium text-2xl mb-4">Gợi ý các công việc tương tự</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2'>
        {loading ? (
          [...Array(5)].map((_, idx) => (
          <JobSkeletonCard key={idx} />
          ))
        ) :jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className='h-full flex flex-col'>
              <Job job={job} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-32">
            <p className="text-gray-500">Không tìm thấy công việc tương tự...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendSimilarJobs;
