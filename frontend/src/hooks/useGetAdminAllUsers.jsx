import { setAllUsers } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAdminAllUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/all-users`, {
                    withCredentials: true,
                });
                
                if(res.data.success){
                    dispatch(setAllUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllUser();
    }, []);
}

export default useGetAdminAllUsers;