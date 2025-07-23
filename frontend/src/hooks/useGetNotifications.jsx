import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotifications } from '@/redux/notificationSlice';
import { NOTIFICATION_API_END_POINT } from '@/utills/constant';

const useGetNotifications = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${NOTIFICATION_API_END_POINT}/`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setNotifications(res.data.notifications));
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchNotifications();
  }, [userId, dispatch]);

};

export default useGetNotifications;