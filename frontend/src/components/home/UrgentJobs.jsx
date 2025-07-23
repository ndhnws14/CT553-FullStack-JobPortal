import React from 'react';
import { useSelector } from 'react-redux';
import UrgentJobCards from './UrgentJobCards';

const UrgentJobs = () => {
  const { allJobs } = useSelector(store => store.job);
  
  const daysDeadline = (date) => {
    const diff = new Date(date) - new Date();
    return Math.floor((diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const urgentJobs = allJobs?.filter(job => {
    if (!job?.duration) return false;
    const daysLeft = daysDeadline(job.duration);
    return daysLeft > 0 && daysLeft <= 10;
  }).sort((a, b) => daysDeadline(a.duration) - daysDeadline(b.duration));

  if (!urgentJobs || urgentJobs.length === 0) return null;

  return (
    <section className='max-w-7xl mx-auto pt-16 px-4'>
      <h1 className='text-4xl font-extrabold mb-6'>
        Việc làm <span className='text-[#fd6908]'>Tuyển gấp</span>
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {urgentJobs.slice(0, 6).map((job) => (
          <UrgentJobCards key={job._id} job={job} />
        ))}
      </div>
    </section>
  );
};

export default UrgentJobs;
