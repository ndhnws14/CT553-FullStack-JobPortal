import React from 'react';
import { useSelector } from 'react-redux';
import LastestJobCards from './LastestJobCards.jsx';

const LastestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  const validJobs = allJobs.filter(job => new Date(job.duration) > new Date());
  const sortedJobs = [...validJobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <section className='max-w-7xl mx-auto pt-10 px-4'>
      <h1 className='text-4xl font-extrabold mb-4'>
        Việc làm <span className='text-[#003699]'>Mới nhất & Hàng đầu</span>
      </h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sortedJobs.length <= 0 ? (
          <span className="text-gray-500">Không có công việc nào...</span>
        ) : (
          sortedJobs.slice(0, 6).map((job) => (
            <LastestJobCards key={job._id} job={job} />
          ))
        )}
      </div>
    </section>
  );
};

export default LastestJobs;
