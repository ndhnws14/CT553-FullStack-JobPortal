import { Mail, Github, Phone } from "lucide-react";
import { Badge } from "./ui/badge";

const UserCardPreview = ({ user }) => {
  const getLevelClass = (levelName) => {
    switch (levelName) {
      case "Intern":
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md";
      case "Fresher":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md";
      case "Junior":
        return "bg-gradient-to-r from-blue-400 to-blue-700 text-white shadow-md";
      case "Middle":
        return "bg-gradient-to-r from-yellow-300 to-yellow-600 text-black shadow-md";
      case "Senior":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const levelClass = getLevelClass(user.profile.level?.name);

  return (
    <div className="p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition space-y-2">
      <div className="flex items-center gap-4">
        <img
          src={user.profile.profilePhoto || "/default-avatar.png"}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover ring-1 ring-blue-400"
        />
        <div className="flex-1">
          <div className="flex items-center flex-wrap">
            <p className="font-semibold text-gray-900 dark:text-white">{user.fullname}</p>
            <span
              className={`ml-2 text-sm font-medium px-3 rounded-full ${levelClass}`}
            >
              {user.profile.level?.name || "Chưa cập nhật"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Mail size={14} /> {user.email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Phone size={14} /> {user.phoneNumber || "Chưa cập nhật"}
          </p>
        </div>
      </div>

      {user.profile.github && (
        <div className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <Github size={16} />
          <a href={user.profile.github} target="_blank" rel="noreferrer">
            {user.profile.github.replace("https://", "")}
          </a>
        </div>
      )}

      <div className="text-sm">
        Kỹ năng nổi bật:
        <div className="flex flex-wrap gap-2 mt-1">
          {user.profile.skills && user.profile.skills.length > 0 ? (
            user.profile.skills.map((s, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-white border"
              >
                {s.skill?.name || "Chưa rõ"} – {s.proficiency || "?"}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic ml-2">Chưa cập nhật</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCardPreview;
