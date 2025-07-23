import React from 'react';
import { CheckCircle } from 'lucide-react';
import GuideLayout from './GuideLayout';
const PhongVan = () => {
  const items = [
    'Nghiên cứu công ty, vị trí và người phỏng vấn.',
    'Chuẩn bị các câu trả lời cho câu hỏi phổ biến (giới thiệu bản thân, điểm mạnh/yếu,...).',
    'Thực hành phỏng vấn giả lập với bạn bè hoặc gương.',
    'Lưu ý trang phục và thái độ chuyên nghiệp.',
  ];

  return (
    <GuideLayout title="Chuẩn bị cho buổi phỏng vấn">
      <p>
        Để thành công trong buổi phỏng vấn, bạn cần chuẩn bị kỹ lưỡng cả về kiến thức chuyên môn lẫn kỹ năng giao tiếp.
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

export default PhongVan;
