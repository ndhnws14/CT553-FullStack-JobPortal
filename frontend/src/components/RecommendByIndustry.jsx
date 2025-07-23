import React, { useEffect, useState } from "react";
import axios from "axios";
import { RECOMMEND_API_END_POINT } from "@/utills/constant";
import Job from "./Job";
import { Button } from "./ui/button";

const industries = [
  { key: "web", label: "🌐 Web Development" },
  { key: "mobile", label: "📱 Mobile Development" },
  { key: "data", label: "📊 Data & Analytics" },
  { key: "ai", label: "🤖 AI & Machine Learning" },
  { key: "devops", label: "⚙️ DevOps" },
  { key: "tester", label: "🔒 Tester" },
];

const RecommendByIndustry = () => {
  const [activeIndustry, setActiveIndustry] = useState("web");
  const [jobs, setJobs] = useState([]);

  const fetchIndustryJobs = async (industry) => {
    try {
      const res = await axios.get(`${RECOMMEND_API_END_POINT}/industry/${industry}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy công việc theo ngành:", err);
    }
  };

  useEffect(() => {
    fetchIndustryJobs(activeIndustry);
  }, [activeIndustry]);

  return (
    <div className="max-w-7xl mx-auto mb-6 pt-10 px-4">
      <h2 className="text-3xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">
        Đề xuất theo ngành phổ biến
      </h2>
      <div className="flex flex-wrap gap-3 mb-4">
        {industries.map((ind) => (
          <Button
            key={ind.key}
            variant={activeIndustry === ind.key ? "default" : "outline"}
            onClick={() => setActiveIndustry(ind.key)}
            className="rounded-xl"
          >
            {ind.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="h-full">
              <Job job={job} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">Không có công việc phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default RecommendByIndustry;
