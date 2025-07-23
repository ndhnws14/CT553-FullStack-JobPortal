import React from 'react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading } from '@/redux/uiSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Introduction = () => {
    const {user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleReloadNavigate = (path) => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập vào GeekJobs.");
            return;
        }
        dispatch(startLoading());
        window.location.href = path;
    };
  return (
    <section className='max-w-7xl mx-auto pt-12 px-4'>
      <h1 className='text-3xl text-center font-extrabold mb-4'>
        Công cụ tốt nhất cho hành trang ứng tuyển của bạn
      </h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6'>
        <div
            className='p-4 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer'
        >
            <div className='flex justify-between items-start mb-3'>
                <div className='flex items-center gap-3'>
                    <img src='/assets/thongtincanhan.svg' alt='capnhatthongtincanhan.svg'/>
                    <div>
                        <h1 className='font-medium text-base text-xl'>Hồ sơ cá nhân</h1>
                        <p className='text-md text-gray-500 flex items-center my-2 gap-1'>
                            Cập nhật hồ sơ với các thông tin cần thiết GeekJobs sẽ gợi ý công việc phù hợp kết nối với nhà tuyển dụng
                        </p>
                        <Button
                            onClick={() => handleReloadNavigate("/profile")}
                            variant='outline'
                            className='text-blue-600 rounded hover:bg-blue-200 hover:text-blue-700 cursor-pointer'
                        >
                            Cập nhật thông tin
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div
            className='p-4 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer'
        >
            <div className='flex justify-between items-start mb-3'>
                <div className='flex items-center gap-3'>
                    <img src='/assets/taocv.svg' alt='maucv.svg'/>
                    <div>
                        <h1 className='font-medium text-base text-xl'>Mẫu CV</h1>
                        <p className='text-md text-gray-500 flex items-center my-2 gap-1'>
                            Bắt đầu tạo CV với mẫu CV IT chuyên nghiệp - được nhà tuyển dụng đề xuất
                        </p>
                        <Button
                            onClick={() => navigate("/create-cv")}
                            variant='outline'
                            className='rounded bg-blue-600 hover:bg-blue-800 text-white hover:text-white cursor-pointer'
                        >
                            Xem mẫu CV
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Introduction;