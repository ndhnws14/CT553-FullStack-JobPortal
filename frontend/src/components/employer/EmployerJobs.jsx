import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input.jsx';
import { Button } from '../ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchJobByText } from '@/redux/jobSlice.js';
import EmployerJobsTable from './EmployerJobsTable.jsx';
import useGetAllEmpoyerJobs from '@/hooks/useGetAllEmpoyerJobs.jsx';
import { stopLoading } from '@/redux/uiSlice.js';

const EmployerJobs = () => {
    useGetAllEmpoyerJobs();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input]);

    useEffect(() => {
        setTimeout(() => {
            dispatch(stopLoading());
        }, 800)
    }, [dispatch]);
  return (
    <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
            <Input 
                className='w-fit rounded-xl dark:text-gray-700'
                placeholder='Lọc công ty, công việc...'
                onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/recruiter/jobs/create")} className='text-white bg-blue-700 hover:bg-blue-500 rounded-xl'>Công việc mới</Button>
        </div>
        <EmployerJobsTable />
    </div>
  )
}

export default EmployerJobs;