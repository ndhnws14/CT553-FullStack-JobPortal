import { useDispatch, useSelector } from 'react-redux';
import useGetNotifications from '@/hooks/useGetNotifications';
import axios from 'axios';
import { NOTIFICATION_API_END_POINT } from '@/utills/constant';
import { deleteNotificationById } from '@/redux/notificationSlice';
import { Trash2 } from 'lucide-react';

const NotificationList = ({ user }) => {
  const { notifications } = useSelector(store => store.notification);
  useGetNotifications(user?._id);

  const dispatch = useDispatch();

  const deleteNotiHandler = async (id) => {
    try {
      const res = await axios.delete(`${NOTIFICATION_API_END_POINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(deleteNotificationById(id));
      }
    } catch (error) {
      console.error('Xóa thông báo thất bại:', error);
    }
  };

  return (
    <>
      { !user ? ( <p className="text-gray-500 text-sm text-center">Không có thông báo</p> ) 
        : (  
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications?.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">Không có thông báo mới</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex justify-between items-center text-sm py-1 border-b ${
                    n.isRead ? 'text-gray-400' : 'text-gray-700 font-semibold'
                  }`}
                >
                  <span>{n.message}</span>
                  <button
                    onClick={() => deleteNotiHandler(n._id)}
                    className="text-red-500 hover:text-red-700 text-xs ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
             )
          )}
        </div>
      )}
    </>
  );
};

export default NotificationList;
