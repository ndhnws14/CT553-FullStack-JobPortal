import { startLoading, stopLoading } from '@/redux/uiSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const Feature = ({ icon, title, desc }) => (
  <div className="p-4 flex flex-col items-center text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-base font-semibold mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

const FeatureCard = ({ title, desc }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
    <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

const HomePageEmployer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    dispatch(startLoading());
    setTimeout(() => {
      navigate(path);
      dispatch(stopLoading());
    }, 500);
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold">
            Nơi gặp gỡ giữa doanh nghiệp và hàng triệu ứng viên{' '}
            <span className="text-blue-600">chất lượng</span>
          </h1>
          <p className="text-lg text-gray-600">Tuyển người dễ dàng với GeekJobs - Chúng tôi luôn có ứng viên phù hợp cho bạn</p>
          <Button
            onClick={() => handleNavigate("/recruiter/companies/create")}
            className="bg-blue-700 text-white py-2 px-6 rounded-xl hover:bg-blue-800 transition"
          >
            Đăng ký công ty ngay!
          </Button>
        </div>
        <div>
          <img src="/assets/tuyen-dung.png" alt="Woman at desk" className="max-w-xl rounded-xl shadow" />
        </div>
      </section>

      {/* Section 2 */}
      <section className="bg-white py-16 px-6 md:px-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <div>
          <img src="/assets/nha-tuyen-dung.jpg" alt="Hiring" className="max-w-xl rounded-xl shadow" />
        </div>
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <h2 className="text-3xl font-bold">
            Đăng tin tuyển dụng, tìm kiếm ứng viên{' '}
            <span className="text-green-600">hiệu quả</span>
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ Đăng tin tuyển dụng miễn phí, đơn giản và nhanh chóng</li>
            <li>✔ Nguồn ứng viên khổng lồ từ nhiều ngành nghề</li>
            <li>✔ Toppy AI lọc ứng viên nổi bật và sắp xếp theo điểm phù hợp</li>
          </ul>
          <Button
            onClick={() => handleNavigate("/recruiter/jobs/create")}
            className="bg-green-700 text-white py-2 px-6 rounded-xl hover:bg-green-800 transition"
          >
            Đăng tin ngay!
          </Button>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-100 py-16 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-12">
          GeekJobs - website việc làm IT phổ biến nhất Việt Nam
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature icon="⏳" title="Ứng viên chất lượng" desc="10 triệu hồ sơ, 50 triệu lượt truy cập mỗi năm" />
          <Feature icon="💎" title="Trải nghiệm toàn diện" desc="Tài khoản tích hợp đầy đủ tính năng thông minh" />
          <Feature icon="🧮" title="Chi phí hợp lý" desc="12++ tin đăng miễn phí/năm, tối ưu chi phí tuyển dụng" />
          <Feature icon="📞" title="CSKH tận tâm" desc="Đội ngũ chuyên nghiệp, hỗ trợ 24/7" />
        </div>
      </section>

      {/* 2025 Version */}
      <section className="bg-blue-50 py-16 px-6 md:px-20">
        <h2 className="text-2xl font-bold text-center mb-12">
          Phiên bản 2025 giúp đăng tuyển nhanh chóng và hiệu quả hơn
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Quản lý công ty"
            desc="Theo dõi thông tin, hiệu suất và báo cáo trực quan về công ty."
          />
          <FeatureCard
            title="Quản lý đăng tuyển"
            desc="1000+ mẫu mô tả công việc theo ngành nghề và vị trí."
          />
          <FeatureCard
            title="Quản lý ứng viên"
            desc="Tích hợp báo cáo, dễ theo dõi ứng viên theo từng vị trí."
          />
        </div>
      </section>
    </div>
  );
};

export default HomePageEmployer;