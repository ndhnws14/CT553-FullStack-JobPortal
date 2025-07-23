import { ArrowRight, CircleDollarSign, Clock, Heart, MapPin, PlaneTakeoff, Send, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import FormatApplyDate from "./FormatApplyDate.jsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip.jsx";
import UserLevelSummary from "./UserLevelSummary.jsx";

const JobHeader = ({ singleJob, isApplied, applyJobHandler, isLoved, user }) => {
    const getLevelClass = (levelName) => {
      switch (levelName) {
        case 'Intern':
            return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md';
        case 'Fresher':
            return 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md';
        case 'Junior':
                return 'bg-gradient-to-r from-blue-400 to-blue-700 text-white shadow-md';
        case 'Middle':
            return 'bg-gradient-to-r from-yellow-300 to-yellow-600 text-black shadow-md';
        case 'Senior':
            return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md';
        default:
            return 'bg-gray-300 text-black';
      }
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Trang chủ</Link> /
          <Link to="/jobs" className="hover:text-black ml-1">Việc làm</Link> /
          <Link to={`/description/${singleJob?._id}`} className="text-black font-semibold ml-1">
            {singleJob?.title}
          </Link>
        </div>

        {/* Background Image */}
        {singleJob?.company?.background && (
          <div className="w-full h-80 rounded-xl overflow-hidden shadow-sm">
            <img
              src={singleJob.company.background}
              alt="Ảnh bìa công ty"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Company Info + Link */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={singleJob?.company?.logo}
              alt={singleJob?.company?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md"
            />
            <h2 className="text-xl font-bold text-blue-800">{singleJob?.company?.name}</h2>
          </div>
          <Link
            to={singleJob?.company?.website}
            className="text-blue-600 hover:underline flex items-center gap-1"
            target="_blank"
          >
            Xem trang công ty <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Job Title + Level Badges + Tags */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center flex-wrap gap-3">
              <h1 className="text-2xl font-bold">{singleJob?.title}</h1>
              {singleJob?.requiredLevels?.length > 0 ? (
                singleJob.requiredLevels.map(level => (
                  <Tooltip key={level._id}>
                    <TooltipTrigger asChild>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full cursor-pointer ${getLevelClass(level.name)}`}
                      >
                        {level.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <UserLevelSummary level={level} />
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">Không yêu cầu trình độ</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-blue-100 text-blue-700" variant="ghost">
                <User2 className="w-4 h-4 mr-1" /> {singleJob?.quantity} vị trí
              </Badge>
              <Badge className="bg-rose-100 text-rose-700" variant="ghost">
                <Clock className="w-4 h-4 mr-1" /> {singleJob?.jobType}
              </Badge>
              <Badge className="bg-violet-100 text-violet-700" variant="ghost">
                <CircleDollarSign className="w-4 h-4 mr-1" /> {singleJob?.salary}
              </Badge>
              <Badge className="bg-green-100 text-green-700" variant="ghost">
                <MapPin className="w-4 h-4 mr-1" /> {singleJob?.company?.location}
              </Badge>
            </div>
          </div>

          {/* Apply Box */}
          <div className="max-w-sm bg-white border border-gray-200 p-4 rounded-2xl shadow-md self-start ml-auto">
            <div className="flex items-center">
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied || !user}
                className={`w-full p-6 text-base font-semibold rounded-xl transition-colors duration-300 ${
                  isApplied
                    ? "bg-gray-600 text-white cursor-not-allowed hover:bg-gray-700"
                    : "bg-blue-700 text-white hover:bg-blue-500"
                }`}
              >
                <Send />
                {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
              </Button>

              <div>
                <Heart
                  className={`w-10 h-10 mx-2 p-2 rounded-xl bg-blue-100 transition-all duration-300 ${
                    isLoved
                      ? "stroke-blue-700 fill-blue-800"
                      : "stroke-blue-700"
                  } cursor-pointer`}
                />
              </div>
            </div>

            <div className="text-sm text-gray-700 text-center my-2">
              <span className="font-semibold">Ngày đăng bài:</span>
              <span className="ml-2 text-gray-800">{FormatApplyDate(singleJob?.createdAt)}</span>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 my-6" />
      </div>
    );
  };
  
  export default JobHeader;