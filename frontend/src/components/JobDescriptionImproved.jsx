import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Globe, Mail, Phone, MapPin, Building2, Pen, User, DollarSign, Clock } from 'lucide-react';
import MapView from './MapView';
import FormatApplyDate from './FormatApplyDate';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="text-blue-600 mt-1" size={18} />
    <div>
      <h4 className="font-semibold text-gray-700">{label}:</h4>
      <p className="text-gray-800 ml-1">{value}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">{title}</h2>
    {children}
  </div>
);

const JobDescriptionImproved = ({ job }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="max-w-7xl mx-auto pt-6 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Chi tiết công việc">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Mô tả:</h3>
                <div className="text-gray-800 space-y-1 ml-4">
                  {job?.description?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Yêu cầu công việc:</h3>
                <div className="text-gray-800 space-y-1 ml-4">
                  {job?.requirements?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Kỹ năng công nghệ yêu cầu:</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.requiredSkills?.map(skill => (
                    <span
                      key={skill._id}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Phúc lợi:</h3>
                <div className="text-gray-800 space-y-1 ml-4">
                  {job?.benefit?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Thông tin khác">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem icon={DollarSign} label="Mức lương" value={job?.salary} />
              <InfoItem icon={User} label="Số lượng" value={job?.quantity} />
              <InfoItem icon={Clock} label="Thời hạn nộp hồ sơ" value={FormatApplyDate(job?.duration)} />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Thông tin công ty">
            <div className={`space-y-2 transition-all duration-300 ${showMore ? 'max-h-fit' : 'max-h-[400px] overflow-hidden'}`}>
              <InfoItem icon={Building2} label="Tên công ty" value={job?.company?.name} />
              <InfoItem icon={Pen} label="Tên viết tắt" value={job?.company?.abbreviationName} />
              <InfoItem icon={MapPin} label="Khu vực" value={job?.company?.location} />
              <InfoItem icon={Mail} label="Email" value={job?.company?.email} />
              <InfoItem icon={Phone} label="Hotline" value={job?.company?.hotline} />
              <div className="flex items-start gap-2">
                <Globe className="text-blue-600 mt-1" size={18} />
                <div>
                  <span className="font-semibold text-gray-700">Trang chủ:</span>
                  <Link
                    to={job?.company?.website}
                    className="text-blue-600 hover:underline ml-2"
                    target="_blank"
                  >
                    {job?.company?.website}
                  </Link>
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Giới thiệu:</span>
                <div className="ml-2 text-gray-800 space-y-1">
                  {job?.company?.description?.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 hover:underline font-semibold"
              >
                {showMore ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
          </Section>

          <Section title="Bản đồ">
            <MapView address={job?.company?.address} />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionImproved;