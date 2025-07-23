import { setAllEmployerApplicants } from '@/redux/applicationSlice';
import { APPLICATION_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllEmpoyerApplicants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllEmpoyerApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/applicants`, {
                    withCredentials: true,
                });

                if(res.data.success){
                    dispatch(setAllEmployerApplicants(res.data.applications));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllEmpoyerApplicants();
    }, []);
}

export default useGetAllEmpoyerApplicants;