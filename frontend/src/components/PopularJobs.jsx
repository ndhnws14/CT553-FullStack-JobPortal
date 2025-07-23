import { JOB_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Job from './Job';

const PopularJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchPopularJobs = async () => {
        try {
           const res = await axios.get(`${JOB_API_END_POINT}/get-popular`);
           setJobs(res.data)
        } catch (error) {
            console.error("Lỗi lấy job phổ biến:", err);
        }
    };
    fetchPopularJobs();
  }, []);
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🔥 Công việc phổ biến</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <Job key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default PopularJobs;