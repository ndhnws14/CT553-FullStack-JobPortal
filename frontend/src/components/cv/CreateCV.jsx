import { startLoading, stopLoading } from "@/redux/uiSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";

const templates = [
  {
    id: "minimal",
    name: "Tối giản",
    image: "/assets/preview-minimal.png",
  },
  {
    id: "classic",
    name: "Cổ điển",
    image: "/assets/preview-classic.png",
  },
  {
    id: "modern",
    name: "Hiện đại",
    image: "/assets/preview-modern.png",
  },
  {
    id: "creative",
    name: "Sáng tạo",
    image: "/assets/preview-creative.png",
  },
];

const CreateCV = () => {
  const {user} = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChooseTemplate = (templateId) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập vào GeekJobs.");
      return;
    } else if(user?.cvId) {
      toast.warning("Bạn đã có hồ sơ cá nhân. Nếu muốn chọn mẫu mới vui lòng xóa hồ sơ hiện có.");
      return;
    }
    dispatch(startLoading());
    setTimeout(() => {
      navigate(`/create-cv-setup?template=${templateId}`);
      dispatch(stopLoading());
    }, 300);
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800);
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-xl font-bold text-center">Chọn Mẫu CV</h1>
      <p className="text-center text-gray-600 mt-2 mb-6">Chọn một mẫu CV bạn yêu thích để bắt đầu tạo hồ sơ cá nhân của mình.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-5">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-xl shadow hover:shadow-lg hover:border-blue-700 transition p-3 flex flex-col items-center"
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-80 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-semibold">{template.name}</h2>
            <Button
              onClick={() => handleChooseTemplate(template.id)}
              className={`"mt-2 rounded w-full bg-blue-600 text-white hover:bg-blue-700" ${!user ? "cursor-not-allowed opacity-70" : "cursor-poniter"}`}
            >
              Dùng Mẫu
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateCV;