import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { startLoading } from '@/redux/uiSlice';

const TopCompaniesCards = ({company}) => {
  const dispatch = useDispatch();

  const handleReloadNavigate = (path) => {
    dispatch(startLoading());
    window.location.href = path;
  };

  return (
    <div
        onClick={() => handleReloadNavigate(`/company-detail/${company?._id}`)} 
        className='p-4 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group'
    >
        <div className="flex flex-col items-center justify-center text-center space-y-2">
            <img src={company?.logo} alt="logo-company.png" className='w-16 h-10 rounded'/>
            <h2 className="font-semibold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">
              {company?.abbreviationName} 
            </h2>
            <div className="flex items-center text-sm text-gray-600">
                <BriefcaseBusiness size={14} className="mr-1 flex-shrink-0"/>
                <span>{company?.jobCount !== undefined ? `${company.jobCount} công việc` : 'Số lượng công việc'}</span>
            </div>
        </div>
    </div>
  )
}

export default TopCompaniesCards;