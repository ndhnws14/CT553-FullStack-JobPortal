import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "🎯 Theo chuyên môn", path: "/recommend-by-skills" },
  { label: "👥 Người dùng tương tự", path: "/recommend-collab" },
];

const JobRecommendationTabs = ({userId}) => {
  const navigate = useNavigate();
  const handleClick = (path) => {
    if (!userId) {
      toast.warning("Vui lòng đăng nhập để xem gợi ý việc làm.");
      return;
    }
    navigate(path);
  };

  return (
    <div className="ml-4 flex flex-wrap items-center gap-2 p-2 rounded-xl">
      <span className="text-lg text-white font-medium">Gợi ý: </span>
      {tabs.map((tab) => (
        <Button
          key={tab.path}
          variant="outline"
          onClick={() => handleClick(tab.path)}
          className="text-sm text-white hover:text-blue-800 hover:bg-blue-200 rounded-xl px-4 py-1.5 transition duration-150"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default JobRecommendationTabs;
