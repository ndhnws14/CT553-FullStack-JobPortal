import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TopCompaniesCards from './TopCompaniesCards';
import { ArrowRight } from 'lucide-react';
import { startLoading } from '@/redux/uiSlice';

const TopCompanies = () => {
  const {companies} = useSelector(store => store.company);
  const dispatch = useDispatch();

  const handleReloadNavigate = (path) => {
    dispatch(startLoading());
    window.location.href = path;
  };
  
  return (
    <section className='max-w-7xl mx-auto pt-10 px-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-extrabold mb-4'>
          Công ty <span className='text-[#451da0]'>Nổi bật</span>
        </h1>
        <span
          onClick={() => handleReloadNavigate("/companies")}
          className="flex items-center text-blue-600 hover:underline cursor-pointer"
        >
          Xem tất cả công ty <ArrowRight className="ml-1 w-4 h-4" />
        </span>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'>
        {companies.length <= 0 ? (
          <span className="text-gray-500">Không có công ty nào...</span>
        ) : (
          companies.slice(0, 6).map((company) => (
            <TopCompaniesCards key={company._id} company={company} />
          ))
        )}
      </div>
    </section>
  )
}

export default TopCompanies;