import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx";
import HeroSection from "./HeroSection";
import UrgentJobs from "./UrgentJobs";
import LastestJobs from "./LastestJobs";
import TopCompanies from "./TopCompanies";
import { stopLoading } from "@/redux/uiSlice";
import Introduction from "./Introduction";
import RecommendByIndustry from "../RecommendByIndustry";
import RecommendByUserBehavior from "../RecommendByUserBehavior";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === "Nhà tuyển dụng") {
      navigate("/recruiter");
    } else if (user?.role === "Quản trị viên") {
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800);
  }, [dispatch]);

  return (
    <div>
      <HeroSection />
      <Introduction />
      { user && <RecommendByUserBehavior user={user} /> }
      <UrgentJobs />
      <LastestJobs />
      <TopCompanies />
      <RecommendByIndustry />
    </div>
  );
};

export default Home;