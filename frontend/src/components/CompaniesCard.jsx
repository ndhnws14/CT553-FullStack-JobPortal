import React, { useEffect, useState } from 'react';
import { MapPin, BriefcaseBusiness } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading } from '@/redux/uiSlice';

const CompaniesCard = () => {
    const {companies, searchCompanyByText} = useSelector(store=>store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const dispatch = useDispatch();

    const handleReloadNavigate = (path) => {
        dispatch(startLoading());
        window.location.href = path;
    };

    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if(!searchCompanyByText){
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

     return (
        <>
            {
                filterCompany?.map((company) => (
                    <div key={company._id} className='p-2 my-4 mx-2 rounded-xl bg-gray-50 dark:bg-[#F3F4F6] border border-gray-200 shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer group'>
                        <div className="flex items-start gap-6 sm:gap-8">
            
                            <img
                                src={company?.logo || 'https://via.placeholder.com/96x96?text=Logo'} 
                                alt={company?.name || 'Company Logo'}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                            />
            
                            <div 
                                onClick={() => handleReloadNavigate(`/company-detail/${company?._id}`)}
                                className='flex-grow flex flex-col justify-between'
                            >
                                <div className="mb-4">
                                    <h2 className='font-bold text-gray-800 text-xl mb-1 group-hover:text-[#003699] transition-colors'>
                                        {company?.name || 'Tên công ty'}
                                    </h2>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                        <MapPin size={14} className="mr-1 flex-shrink-0"/>
                                        <span>{company?.address || 'Địa chỉ công ty'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <BriefcaseBusiness size={14} className="mr-1 flex-shrink-0"/>
                                        <span>{company?.jobCount !== undefined ? `${company.jobCount} công việc` : 'Số lượng công việc'}</span>
                                    </div>
                                </div>
            
                            </div>
            
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default CompaniesCard;