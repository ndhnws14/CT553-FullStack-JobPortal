import { Facebook, Linkedin, Youtube } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-10 text-sm text-gray-700">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-xl font-bold mb-3">GeekJobs</h2>
          <p className="mb-2">Nền tảng tìm kiếm việc làm hàng đầu giúp kết nối ứng viên và nhà tuyển dụng.</p>
          <p>© 2025 GeekJobs. All rights reserved.</p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Trang chủ</a></li>
            <li><a href="/jobs" className="hover:underline">Việc làm</a></li>
            <li><a href="" className="hover:underline">Công ty</a></li>
            <li><a href="" className="hover:underline">Về chúng tôi</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3">Hỗ trợ</h3>
          <ul className="space-y-2">
            <li><a href="" className="hover:underline">Câu hỏi thường gặp</a></li>
            <li><a href="" className="hover:underline">Chính sách bảo mật</a></li>
            <li><a href="" className="hover:underline">Điều khoản sử dụng</a></li>
            <li><a href="" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3">Liên hệ</h3>
          <p>Email: support@geekjobs.vn</p>
          <p>Hotline: 1900 1234</p>
          <div className="flex space-x-4 mt-3">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-600">
              <Facebook/>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-blue-700">
              <Linkedin/>
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:text-red-600">
              <Youtube/>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
