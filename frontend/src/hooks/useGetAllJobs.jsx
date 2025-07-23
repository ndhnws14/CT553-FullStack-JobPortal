import { setAllJobs } from '@/redux/jobSlice.js';
import { JOB_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        }
        fetchAllJobs();
    }, [dispatch]);
    
}

export default useGetAllJobs;