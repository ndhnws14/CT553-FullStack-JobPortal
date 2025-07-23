import React from 'react';
import { CheckCircle } from 'lucide-react';
import GuideLayout from './GuideLayout';

const HanhTrang = () => {
  const items = [
    'Khám phá bản thân thông qua các bài test MBTI, Holland Code,...',
    'Tìm hiểu thị trường lao động hiện tại và xu hướng tương lai.',
    'Tham khảo lời khuyên từ người đi trước hoặc cố vấn nghề nghiệp.',
    'Lập kế hoạch phát triển cá nhân ngắn hạn và dài hạn.',
  ];

  return (
    <GuideLayout title="Hành trang nghề nghiệp">
      <p>
        Việc xác định đúng định hướng nghề nghiệp giúp bạn phát triển sự nghiệp bền vững. Hãy bắt đầu bằng việc hiểu rõ bản thân: sở thích, điểm mạnh, điểm yếu, giá trị cá nhân và phong cách làm việc.
      </p>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1" />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </GuideLayout>
  );
};

export default HanhTrang;
