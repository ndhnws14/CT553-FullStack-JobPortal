import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Contact, Mail } from 'lucide-react';
import useGetAllEmployerCompanies from '@/hooks/useGetAllEmployerCompanies';
import EmployerCompaniesTable from './EmployerCompaniesTable';
import useGetAllEmpoyerJobs from '@/hooks/useGetAllEmpoyerJobs';
import EmployerJobsTable from './EmployerJobsTable';
import EmployerApplicantsInProfile from './EmployerApplicantsInProfile';
import useGetAllEmpoyerApplicants from '@/hooks/useGetAllEmpoyerApplicants';

const EmployerProfile = () => {
    useGetAllEmployerCompanies();
    useGetAllEmpoyerJobs();
    useGetAllEmpoyerApplicants();
    const { user } = useSelector(store => store.auth);

  return (
    <>
        <div className='max-w-4xl mx-auto bg-white border border-gray-200 dark:text-gray-700 rounded-xl my-5 p-4 shadow-sm'>
            <div className='flex justify-between items-start'>
                <div className='flex items-center gap-6'>
                    <Avatar className="h-28 w-28">
                        <AvatarImage src={user?.profile?.profilePhoto ?? ""} alt={user?.fullname || "Avatar"} />
                    </Avatar>
                    <div>
                        <h1 className='font-bold text-2xl mb-1'>{user?.fullname || "Người dùng"}</h1>
                    </div>
                </div>
            </div>
            <div className='my-6 border-t pt-6'>
                <h2 className='text-lg font-bold mb-3'>Thông tin liên hệ hỗ trợ</h2>
                <div className='flex items-center gap-3 my-2 text-gray-700'>
                    <Mail size={18} />
                    <span>{user?.email || "Chưa có Email"}</span>
                </div>
                <div className='flex items-center gap-3 my-2 text-gray-700'>
                    <Contact size={18} />
                    <span>{user?.phoneNumber || "Chưa có Số điện thoại"}</span>
                </div>
            </div>
        </div>
        <div className='max-w-4xl mx-auto bg-white rounded-xl my-5 p-4 shadow-md dark:text-gray-700'>
            <h1 className="text-xl font-bold mb-5">Công ty đã đăng ký</h1>
            <EmployerCompaniesTable />
        </div>
        <div className='max-w-4xl mx-auto bg-white rounded-xl my-5 p-4 shadow-md dark:text-gray-700'>
            <h1 className="text-xl font-bold mb-5">Công việc đã đăng tin tuyển dụng</h1>
            <EmployerJobsTable />
        </div>
         <div className='max-w-4xl mx-auto bg-white rounded-xl my-5 p-4 shadow-md dark:text-gray-700'>
            <h1 className="text-xl font-bold mb-5">Danh sách ứng viên đã nộp hồ sơ</h1>
            <EmployerApplicantsInProfile />
        </div>
    </>
  )
}

export default EmployerProfile;