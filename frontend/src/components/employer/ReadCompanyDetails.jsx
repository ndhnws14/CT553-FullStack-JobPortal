import React from 'react';

const ReadCompanyDetails = ({ company }) => {
  if (!company) return <p className="text-center">Không có thông tin công ty</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      {/* Background banner */}
      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${company.background})` }} />

      <div className="p-6">
        {/* Logo và tên */}
        <div className="flex items-center space-x-4">
          <img src={company.logo} alt="logo" className="w-20 h-20 object-contain rounded-full border p-1" />
          <div>
            <h2 className="text-2xl font-bold text-blue-700">{company.name}</h2>
            <p className="text-sm text-gray-500">{company.abbreviationName} - {company.location}</p>
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">📍 Địa chỉ</h3>
            <p className="text-gray-600">{company.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">📞 Hotline</h3>
            <p className="text-gray-600">{company.hotline}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">📧 Email</h3>
            <p className="text-gray-600">{company.email}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">🌐 Website</h3>
            <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-500 underline">{company.website}</a>
          </div>
        </div>

        {/* Mô tả */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">📝 Giới thiệu</h3>
          <p className="text-gray-700 whitespace-pre-line text-justify">{company.description}</p>
        </div>

        {/* Lĩnh vực hoạt động */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">💼 Lĩnh vực hoạt động</h3>
          <p className="text-gray-700 whitespace-pre-line text-justify">{company.field}</p>
        </div>
      </div>
    </div>
  );
};

export default ReadCompanyDetails;
