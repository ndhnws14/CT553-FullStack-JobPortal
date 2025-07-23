import React from 'react';
import { CheckCircle } from 'lucide-react';
import GuideLayout from './GuideLayout';

const KyNangMem = () => {
  const items = [
    'Kỹ năng giao tiếp, lắng nghe, thuyết trình.',
    'Kỹ năng quản lý thời gian, giải quyết vấn đề.',
    'Kỹ năng làm việc nhóm, lãnh đạo.',
    'Kỹ năng học hỏi và phát triển bản thân.',
  ];

  return (
    <GuideLayout title="Phát triển kỹ năng mềm">
      <p>
        Kỹ năng mềm đóng vai trò quan trọng trong sự nghiệp: giúp bạn làm việc nhóm hiệu quả, giao tiếp tốt và thích nghi với môi trường mới.
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

export default KyNangMem;
