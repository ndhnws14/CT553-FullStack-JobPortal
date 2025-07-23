import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Job from './Job.jsx';
import socket from '@/lib/socket.js';
import { addJob, removeJob, setAllJobs } from '@/redux/jobSlice.js';
import JobSearchBar from './JobSearchBar.jsx';
import { JOB_API_END_POINT } from '@/utills/constant.js';
import axios from 'axios';
import { stopLoading } from '@/redux/uiSlice.js';
import RecommendBySkills from './RecommendBySkills.jsx';
import PopularJobs from './PopularJobs.jsx';
import { ArrowLeft, ArrowLeftCircle, ArrowLeftFromLine, ArrowRight, ArrowRightCircle } from 'lucide-react';

const JOBS_PER_PAGE = 20;

const isNewJob = (createdAt) => {
  const MILLISECONDS_PER_DAY = 86400000;
  const daysAgo = (Date.now() - new Date(createdAt).getTime()) / MILLISECONDS_PER_DAY;
  return daysAgo < 3;
};

const Jobs = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    selectedTechs: [],
    location: '',
    levels: [],
  });

  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

  const handleSearch = async ({ keyword, selectedTechs, location, levels, page = 1 }) => {
    try {
      setFilters({ keyword, selectedTechs, location, levels });

      const res = await axios.get(`${JOB_API_END_POINT}/get`, {
        params: {
          keyword,
          skills: selectedTechs.join(','),
          location,
          levels: levels.join(','),
          page,
          limit: JOBS_PER_PAGE,
        }
      });

      if (res.data.success) {
        const sorted = res.data.jobs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        dispatch(setAllJobs(sorted));
        setFilteredJobs(sorted);
        setTotalJobs(res.data.totalJobs || sorted.length);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      dispatch(setAllJobs([]));
      setFilteredJobs([]);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    socket.on('job_post', (job) => dispatch(addJob(job)));
    socket.on('job_deleted', (id) => dispatch(removeJob(id)));

    return () => {
      socket.off('job_post');
      socket.off('job_deleted');
    };
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800);
  }, [dispatch]);

  useEffect(() => {
    handleSearch({
      keyword: '',
      selectedTechs: [],
      location: '',
      levels: [],
      page: 1
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <>
      <div className="relative w-full">
        <div className="absolute inset-0 w-full h-[430px] sm:h-96 lg:h-44 -z-10">
          <img src="/assets/bg-blue-banner.jpeg" alt="Background" className="w-full h-full object-cover" />
        </div>
      </div>


      <div className="max-w-7xl mx-auto mt-5">
        <div className="mb-3">
          <JobSearchBar onSearch={handleSearch} />
        </div>

        <div className="flex gap-6">
          <div className="flex-1 pb-4">
            <div className='flex items-center justify-between'>
              <span className="font-bold text-2xl text-white dark:text-gray-200 mx-2">
                {totalJobs} Việc làm IT "Chất" mới nhất năm 2025
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">Không tìm thấy công việc.</p>
            ) : (
              <>
                <div className="mt-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredJobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      key={job._id}
                      className="h-full transition-transform hover:scale-[1.02] relative"
                    >
                      {isNewJob(job.createdAt) && (
                        <span className="absolute top-1 right-1 bg-[#F97316] text-white text-xs font-extrabold px-2 py-1 rounded animate-bounce shadow">
                          NEW
                        </span>
                      )}
                      <div className="h-full flex flex-col mt-3">
                        <Job job={job} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      handleSearch({ ...filters, page: newPage });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 rounded disabled:opacity-50"
                  >
                    <ArrowLeftCircle />
                  </button>
                  <span className="text-sm mt-2">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      handleSearch({ ...filters, page: newPage });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-2 rounded disabled:opacity-50"
                  >
                    <ArrowRightCircle />
                  </button>
                </div>
              </>
            )}

            <div className='bg-white p-6 my-8 rounded-2xl shadow-sm border border-gray-100'>
              {!user || !(user.profile?.skills?.length > 0) ? (
                <PopularJobs />
              ) : (
                <RecommendBySkills />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
