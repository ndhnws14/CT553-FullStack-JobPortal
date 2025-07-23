import React, { useEffect, useState } from 'react';
import CompaniesCard from './CompaniesCard';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from './ui/input';
import { removeCompany, setSearchCompanyByText } from '@/redux/companySlice';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import socket from '@/lib/socket';
import { stopLoading } from '@/redux/uiSlice';

const Companies = () => {
  useGetAllCompanies();
  const {companies} = useSelector(store => store.company)
  const dispatch = useDispatch();

  const [input, setInput] = useState("");

  useEffect(() => {
      dispatch(setSearchCompanyByText(input));
  }, [input]);

  useEffect(() => {
    setTimeout(() => {
        dispatch(stopLoading());
    }, 800)
  }, [dispatch]);

  useEffect(() => {
    const onCompanyDeleted = (companyId) => {
        dispatch(removeCompany(companyId));
    };

    socket.on("company_deleted", onCompanyDeleted);

    return () => {
        socket.off("company_deleted", onCompanyDeleted);
    };
  }, [dispatch]);

  return (
        <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between my-5'>
              <h1 className='font-bold text-xl'>Danh sách các công ty ({companies.length})</h1>
              <Input 
                  className='w-fit rounded dark:text-gray-700'
                  placeholder='Lọc theo tên công ty...'
                  onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <CompaniesCard />
        </div>
  )
}

export default Companies;