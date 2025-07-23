
import { setCV } from '@/redux/cvSlice';
import { CV_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetCVById = (cvId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCV = async () => {
            try {
                const res = await axios.get(`${CV_API_END_POINT}/get/${cvId}`, {
                    withCredentials: true,
                });
                
                if(res.data.success){
                    dispatch(setCV(res.data.cv));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCV();
    }, [cvId, dispatch]);
}

export default useGetCVById;