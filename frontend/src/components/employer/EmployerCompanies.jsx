import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input.jsx';
import { Button } from '../ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice.js';
import EmployerCompaniesTable from './EmployerCompaniesTable.jsx';
import useGetAllEmployerCompanies from '@/hooks/useGetAllEmployerCompanies.jsx';
import { stopLoading } from '@/redux/uiSlice.js';

const EmployerCompanies = () => {
    useGetAllEmployerCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
        setTimeout(() => {
            dispatch(stopLoading());
        }, 800)
    }, [input, dispatch]);
   
  return (
    <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
            <Input 
                className='w-fit rounded-xl dark:text-gray-700'
                placeholder='Lọc theo tên công ty...'
                onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/recruiter/companies/create")} className='text-white bg-blue-700 hover:bg-blue-500 rounded-xl'>Tạo công ty mới</Button>
        </div>
        <EmployerCompaniesTable />
    </div>
  )
}

export default EmployerCompanies;