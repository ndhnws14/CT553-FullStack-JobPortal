import { setAllCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllEmployerCompanies = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/admin-getcompany`, {
                    withCredentials: true,
                });
                
                if(res.data.success){
                    dispatch(setAllCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    }, []);
}

export default useGetAllEmployerCompanies;