import { RECOMMEND_API_END_POINT } from '@/utills/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CandidateCard from './CandidateCard';

const RecommendCandidates = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(
          `${RECOMMEND_API_END_POINT}/candidates/${jobId}`, { withCredentials: true }
        );
        
        setCandidates(res.data.candidates);
      } catch (err) {
        console.error("Lỗi lấy gợi ý ứng viên:", err);
      }
    };
    fetchCandidates();
  }, [jobId]);

  return (
    <div className="mt-6">
      { candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate, index) => (
            <CandidateCard key={index} user={candidate} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Không tìm thấy ứng viên phù hợp.</p>
      )}
    </div>
  );
};

export default RecommendCandidates;