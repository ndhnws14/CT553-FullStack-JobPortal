import React from 'react';

import { Card, CardContent } from '../ui/card';

import Sidebar from '../shared/Sidebar.jsx';

const AdminHome = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto p-10">
        <Card className="max-w-4xl mx-auto shadow-md rounded-xl">
          <CardContent className="flex flex-col items-center justify-center text-center p-10">
            <img
              src="/assets/dashboard-admin.webp"
              alt="Admin dashboard illustration"
              className="w-96 mb-6 rounded-xl shadow"
            />
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
              Chào mừng đến với trang quản trị <span className="text-blue-600">GeekJobs.vn</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl">
              Tại đây, bạn có thể quản lý tài khoản người dùng, công ty, bài đăng, kỹ năng và thống kê toàn bộ hệ thống. Hãy sử dụng sidebar bên trái để bắt đầu.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
