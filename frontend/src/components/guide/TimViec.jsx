import React from 'react';
import GuideLayout from './GuideLayout';

const TimViec = () => {
  const steps = [
    'Tạo hồ sơ ứng tuyển chuyên nghiệp (CV, LinkedIn,...).',
    'Thường xuyên theo dõi các trang tuyển dụng và công ty quan tâm.',
    'Sử dụng mạng lưới cá nhân để tìm cơ hội.',
    'Chủ động gửi hồ sơ và follow-up nhà tuyển dụng.',
  ];

  return (
    <GuideLayout title="Chiến lược tìm việc hiệu quả">
      <p>
        Việc tìm kiếm cơ hội phù hợp cần một chiến lược rõ ràng và chủ động.
      </p>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </GuideLayout>
  );
};

export default TimViec;
