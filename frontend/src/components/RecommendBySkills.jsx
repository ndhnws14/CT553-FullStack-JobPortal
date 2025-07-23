import React, { useEffect, useState } from 'react';
import { RECOMMEND_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import Job from './Job';
import JobSkeletonCard from './loaders/JobSkeletonCard';
import { useSelector } from 'react-redux';
import { Lightbulb } from 'lucide-react';

const RecommendBySkills = () => {
    const { user } = useSelector(store => store.auth);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchRecommendBySkills = async () => {
            try {
                const res = await axios.get(`${RECOMMEND_API_END_POINT}/by-skill/${user?._id}`, {
                    withCredentials: true
                });
                setJobs(res.data);
            } catch (err) {
                console.error('Lỗi khi lấy gợi ý công việc:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendBySkills();
    }, [user?._id]);

  return (
    <div className='max-w-7xl mx-auto my-2 px-4'>
        <h2 className="flex items-center text-3xl font-bold mb-4 dark:text-gray-800">
            <Lightbulb size={32} className='mr-2 text-yellow-400 animate-pulse'/> 
            <span>
                Công việc phù hợp với <span className='text-blue-600'>kỹ năng</span> của bạn
            </span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {loading ? (
                [...Array(8)].map((_, idx) => (
                    <JobSkeletonCard key={idx} />
                ))
            ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                    <div key={job._id} className='h-full flex flex-col'>
                        <Job job={job} />
                    </div>
                ))
            ) : (
                <div className="col-span-full flex items-center justify-center h-32">
                    <p className="text-gray-500">Không có gợi ý việc làm phù hợp.</p>
                </div>
            )}
            </div>
    </div>
  )
}

export default RecommendBySkills;