import { MapPin} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/uiSlice";

const CompanyCardPreview = ({ company }) => {
    const dispatch = useDispatch();
    const handleReloadNavigate = (path) => {
        dispatch(startLoading());
        window.location.href = path;
    };

  return (
    <div
      onClick={() => handleReloadNavigate(`/company-detail/${company?._id}`)}
      className="h-full flex flex-col p-3 rounded-xl bg-white dark:bg-zinc-100 hover:shadow-xl hover:border-blue-300 cursor-pointer border shadow-md transition"
    >
      <div className="flex gap-3 items-center mb-2">
        <Avatar className="w-14 h-14 ring-1 ring-blue-200 rounded-xl">
          <AvatarImage src={company.logo} />
        </Avatar>
        <div className="flex flex-col justify-between">
          <h2 className="text-base font-semibold text-gray-900 truncate w-[180px]">
            {company.name}
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {company.location || "Không rõ"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCardPreview;
