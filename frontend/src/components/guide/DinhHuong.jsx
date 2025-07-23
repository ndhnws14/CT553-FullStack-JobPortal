import React from 'react';
import { CheckCircle } from 'lucide-react';

const DinhHuong = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white">
        Định hướng nghề nghiệp
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Việc xác định đúng <strong className="text-indigo-600 dark:text-indigo-400">định hướng nghề nghiệp</strong> giúp bạn phát triển sự nghiệp bền vững và tránh đi sai đường. Hãy bắt đầu bằng việc hiểu rõ bản thân: sở thích, điểm mạnh - điểm yếu, giá trị cá nhân và phong cách làm việc.
      </p>

      <div className="space-y-4">
        {[
          'Khám phá bản thân thông qua các bài test MBTI, Holland Code,...',
          'Tìm hiểu thị trường lao động hiện tại và xu hướng tương lai.',
          'Tham khảo lời khuyên từ người đi trước hoặc cố vấn nghề nghiệp.',
          'Lập kế hoạch phát triển cá nhân ngắn hạn và dài hạn.',
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DinhHuong;
