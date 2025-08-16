import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/input.jsx';
import { Button } from '../ui/button.jsx';
import { COMPANY_API_END_POINT } from '@/utills/constant.js';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setSingleCompany } from '@/redux/companySlice.js';

const EmployerCompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState();
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    try {
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if(res.data.success){
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res.data.company?._id;
        navigate(`/recruiter/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message);
    }
  }
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='my-10'>
        <h1 className='font-bold text-2xl'>Tên công ty của bạn</h1>
        <p className='text-sm text-gray-500'>Bạn muốn đặt tên công ty của bạn là gì? Bạn có thể thay đổi điều này sau.</p>
      </div>

      <Label>Tên công ty</Label>
      <Input
        type='text'
        className='my-2 text-sm text-gray-500 rounded-xl'
        placeholder='vd: VNPT, Google, ...'
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <div className='flex items-center gap-2 my-10'>
        <Button onClick={() => navigate("/recruiter/companies")} variant='outline' className='hover:bg-[#e70b38] hover:text-white rounded-xl'>Hủy</Button>
        <Button onClick={ registerNewCompany } className='text-white bg-blue-700 hover:bg-blue-500 rounded-xl'>Tiếp tục</Button>
      </div>
    </div>
  )
}

export default EmployerCompanyCreate;