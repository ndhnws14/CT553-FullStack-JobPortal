import { setAllApplicants } from '@/redux/applicationSlice';
import { APPLICATION_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetEmployerApplicants = ( jobId ) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchEmpoyerApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
                    withCredentials: true,
                });
                if(res.data.success){
                    dispatch(setAllApplicants({ applications: res.data.job.applications }));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchEmpoyerApplicants();
    }, []);
}

export default useGetEmployerApplicants;