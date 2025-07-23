import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateCVButton = () => {
  const navigate = useNavigate();

  return (
    <li
      className="flex items-center font-medium text-white border border-blue-500 hover:bg-blue-500 rounded-xl p-2 mr-4 cursor-pointer"
      onClick={() => navigate("/create-cv")}
    >
      <Plus className="w-4 h-4 mr-2" />
      Tạo CV
    </li>
  );
};

export default CreateCVButton;
