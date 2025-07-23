import React from 'react';
import GuideLayout from './GuideLayout';

const VietCV = () => {
  const steps = [
    'Thông tin cá nhân và mục tiêu nghề nghiệp.',
    'Học vấn, kinh nghiệm làm việc và kỹ năng liên quan.',
    'Hoạt động ngoại khóa, giải thưởng, chứng chỉ (nếu có).',
    'Chú ý đến trình bày, chính tả và độ dài CV (1–2 trang).',
  ];

  return (
    <GuideLayout title="Hướng dẫn viết CV chuyên nghiệp">
      <p>
        CV là công cụ quan trọng giúp bạn ghi điểm với nhà tuyển dụng. Một CV ấn tượng phải ngắn gọn, rõ ràng và làm nổi bật được giá trị của bạn.
      </p>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </GuideLayout>
  );
};

export default VietCV;
