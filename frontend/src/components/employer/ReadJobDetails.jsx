import React from 'react';
import FormatApplyDate from '../FormatApplyDate';

const ReadJobDetails = ({ job }) => {
  if (!job) return <p className="text-center">Không có thông tin công việc</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{job.title}</h2>
        <p className="text-sm text-gray-500">Loại hình: {job.jobType} | Số lượng: {job.quantity}</p>
      </div>

      <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">📚 Trình độ yêu cầu</h3>
          {job.requiredLevels && job.requiredLevels.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {job.requiredLevels.map(level => (
                <li key={level._id}>{level.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không yêu cầu trình độ cụ thể</p>
          )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">💰 Mức lương</h3>
          <p className="text-gray-800">{job.salary}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">📅 Thời hạn</h3>
          <p className="text-gray-800">{FormatApplyDate(job.duration)}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">🎯 Mô tả công việc</h3>
          <p className="text-gray-700 whitespace-pre-line text-justify">{job.description}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">🧠 Yêu cầu</h3>
          <p className="text-gray-700 whitespace-pre-line text-justify">{job.requirements}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">🔧 Kỹ năng yêu cầu</h3>
          {job.requiredSkills && job.requiredSkills.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {job.requiredSkills.map(skill => (
                <li key={skill._id}>{skill.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không yêu cầu kỹ năng cụ thể</p>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">🎁 Phúc lợi</h3>
          <p className="text-gray-700 whitespace-pre-line text-justify">{job.benefit}</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-right">
        Ngày đăng: {FormatApplyDate(job.createdAt)}
      </div>
    </div>
  );
};

export default ReadJobDetails;