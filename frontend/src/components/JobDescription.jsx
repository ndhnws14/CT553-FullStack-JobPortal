import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utills/constant.js';
import { setSingleJob } from '@/redux/jobSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import JobHeader from './JobHeader.jsx';
import Footer from './shared/Footer.jsx';
import socket from '@/lib/socket.js';
import RecommendSimilarJobs from './RecommendSimilarJobs.jsx';
import { stopLoading } from '@/redux/uiSlice.js';
import JobDescriptionImproved from './JobDescriptionImproved.jsx';

const JobDescription = () => {
    const {singleJob} = useSelector(store=>store.job);
    const {user} = useSelector(store=>store.auth);

    const isInitApplied = singleJob?.applications?.some(application=>application.applicant === user?._id) || false;
    const isInitLoved = user?.lovedJobs?.some(jobId => jobId === singleJob?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitApplied);
    const [isLoved, setIsLoved] = useState(isInitLoved);

    const params = useParams();
    const jobId = params.id;
    const dispatch =useDispatch();

    const applyJobHandler = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Vui lòng đăng nhập trước khi ứng tuyển!");
                return;
            }

            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            
            if(res.data.success){
                toast.success(res.data.message);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications, {applicant: user?._id}]} ;
                dispatch(setSingleJob(updatedSingleJob)); 
                setIsApplied(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi ứng tuyển.");
        }
    };


    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                dispatch(setSingleJob(null));
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
                
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(
                        res.data.job?.applications?.some(application => application.applicant === user?._id)
                    );
                }
            } catch (error) {
                console.error(error.response?.data?.message || error.message);
            }
        };

        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    useEffect(() => {
        const onUpdateJob = (job) => {
            dispatch(setSingleJob(job));
        };
        socket.on("job_updated", onUpdateJob);

        return () => {
            socket.off("job_updated", onUpdateJob);
        };
    }, [dispatch]);

    useEffect(() => {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
    });
    
  return (
    <div>
        <div className='max-w-7xl mx-auto pt-4'>
            <JobHeader
                singleJob={singleJob}
                isApplied={isApplied}
                isLoved={isLoved}
                applyJobHandler={applyJobHandler}
                user={user}
            />
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-start p-6">
                <JobDescriptionImproved job={singleJob} />
            </div>
            <div>
                <RecommendSimilarJobs jobId={jobId} />
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default JobDescription;