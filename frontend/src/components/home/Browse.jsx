import React, { useEffect } from 'react';
import Job from '../Job';
import { useDispatch, useSelector } from 'react-redux';
import { stopLoading } from '@/redux/uiSlice';
import { useLocation } from 'react-router-dom';

const Browse = () => {
    const { allJobs } = useSelector((store) => store.job);
    const dispatch = useDispatch();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchedQuery = queryParams.get('q')?.toLowerCase() || '';

    const filteredJobs = searchedQuery
        ? allJobs.filter((job) => {
            return (
                job.title?.toLowerCase().includes(searchedQuery) ||
                job.company?.abbreviationName?.toLowerCase().includes(searchedQuery) ||
                (Array.isArray(job.requiredSkills) &&
                    job.requiredSkills.some(
                        (req) => req?.name?.toLowerCase().includes(searchedQuery)
                    ))
            );
        })
        : allJobs;

    useEffect(() => {
        setTimeout(() => {
            dispatch(stopLoading());
        }, 800);
    }, [dispatch]);

    return (
        <div>
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Kết quả tìm kiếm ({filteredJobs.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-5'>
                    {filteredJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browse;
