import React, { useEffect } from 'react';
import { Backpack, BookOpenText, Group, Lightbulb, Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { stopLoading } from '@/redux/uiSlice';

const guides = [
  {
    title: "Định hướng nghề nghiệp",
    desc: "Tìm hiểu ngành nghề phù hợp với tính cách và kỹ năng của bạn.",
    icon: <TrendingUp className="w-6 h-6" />,
    link: "/guide/dinh-huong",
  },
  {
    title: "Kỹ năng viết CV",
    desc: "Hướng dẫn viết CV nổi bật, gây ấn tượng với nhà tuyển dụng.",
    icon: <BookOpenText className="w-6 h-6" />,
    link: "/guide/viet-cv",
  },
  {
    title: "Kinh nghiệm phỏng vấn",
    desc: "Bí kíp chuẩn bị phỏng vấn, trả lời câu hỏi khó.",
    icon: <Lightbulb className="w-6 h-6" />,
    link: "/guide/phong-van",
  },
  {
    title: "Kỹ năng mềm",
    desc: "Kỹ năng mềm cũng là một phần quan trọng khi tìm việc.",
    icon: <Group className="w-6 h-6" />,
    link: "/guide/ky-nang-mem",
  },
  {
    title: "Kinh nghiệm tìm việc",
    desc: "Bí kíp giúp bạn tìm việc hiệu quả.",
    icon: <Search className="w-6 h-6" />,
    link: "/guide/tim-viec",
  },
  {
    title: "Hành trang nghề nghiệp",
    desc: "Một hành trang vững vàng giúp bạn tự tin hơn.",
    icon: <Backpack className="w-6 h-6" />,
    link: "/guide/hanh-trang",
  },
];

const CareerGuide = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800);
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-gray-800 dark:text-white">
        Cẩm nang nghề nghiệp
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        Khám phá những hướng dẫn chi tiết giúp bạn vững bước trên con đường sự nghiệp.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <Link
            to={guide.link}
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 bg-white dark:bg-gray-900 flex flex-col gap-3 transform hover:-translate-y-1 group"
          >
            <div className="text-indigo-600 bg-indigo-100 dark:bg-indigo-900 p-2 w-fit rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition">
              {guide.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
              {guide.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{guide.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CareerGuide;
