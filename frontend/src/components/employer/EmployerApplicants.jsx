import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EmployerApplicantsTable from './EmployerApplicantsTable.jsx';
import { useSelector } from 'react-redux';
import useGetEmployerApplicants from '@/hooks/useGetEmployerApplicants.jsx';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utills/constant.js';

const EmployerApplicants = () => {
    const params = useParams();
    const [job, setJob] = useState(null);

    useGetEmployerApplicants(params.id);
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
      const fetchJob = async () => {
          try {
              const res = await axios.get(`${JOB_API_END_POINT}/get-job/${params.id}`, { withCredentials: true });
              setJob(res.data.job);
          } catch (err) {
              toast.error("Không thể tải thông tin công việc");
          }
      };
      fetchJob();
    }, [params.id]);
  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-2xl text-center text-[#003699] font-bold mt-5'>{job?.title}</h1>
        <h2 className='font-bold text-xl my-5'>Danh sách ứng viên ({applicants?.applications?.length})</h2>
        <EmployerApplicantsTable />
    </div>
  )
}

export default EmployerApplicants;