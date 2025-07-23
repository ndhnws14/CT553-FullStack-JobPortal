import React from 'react';
import { User2, Target } from 'lucide-react';

const UserLevelSummary = ({ level }) => {
  if (!level) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 text-sm text-gray-700">
      <h3 className="text-base font-semibold text-blue-700">{level.name}</h3>

      <div className="flex items-start gap-2">
        <User2 className="w-4 h-4 mt-0.5 text-blue-500" />
        <div>
          <p className="font-medium text-gray-800">Kinh nghiệm:</p>
          <p>{level.exprience || 'Không xác định'}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Target className="w-4 h-4 mt-0.5 text-blue-500" />
        <div>
          <p className="font-medium text-gray-800">Mục tiêu:</p>
          <p>{level.target || 'Không xác định'}</p>
        </div>
      </div>

      {level.skill_description && (
        <div className="pt-2 border-t">
          <p className="font-medium text-gray-800 mb-1">Mô tả kỹ năng:</p>
          <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3">
            {level.skill_description}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserLevelSummary;
