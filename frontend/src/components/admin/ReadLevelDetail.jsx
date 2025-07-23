import React from 'react';
import { User2, Target, BadgeInfo } from 'lucide-react';

const ReadLevelDetail = ({ level }) => {
  if (!level) return <p>Không có dữ liệu trình độ.</p>;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-600">{level.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <User2 className="w-5 h-5" />
            Kinh nghiệm yêu cầu
          </h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border">{level.exprience}</p>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Target className="w-5 h-5" />
            Mục tiêu
          </h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border">{level.target}</p>
        </div>

        <div className="md:col-span-2 space-y-2">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <BadgeInfo className="w-5 h-5" />
            Mô tả kỹ năng
          </h4>
          <div className="bg-gray-50 p-4 rounded-xl border text-gray-700 whitespace-pre-line">
            {level.skill_description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadLevelDetail;
