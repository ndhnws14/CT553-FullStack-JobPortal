import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { STATISTICS_API_END_POINT } from '@/utills/constant';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

const EmployerStatistics = () => {
  const [stats, setStats] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const query = month && year ? `?month=${month}&year=${year}` : '';
        const res = await axios.get(`${STATISTICS_API_END_POINT}/employer${query}`, { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thống kê", err);
      }
    };
    fetchStats();
  }, [month, year]);

  if (!stats) return <p className="text-center text-gray-600 text-lg">Đang tải thống kê...</p>;

  const shortNames = stats.companyStats.map(c =>
    c.name.length > 30 ? c.name.slice(0, 30) + '...' : c.name
  );

  const barData = {
    labels: shortNames,
    datasets: [
      {
        label: 'Số lượng công việc',
        data: stats.companyStats.map(c => c.jobCount),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 20,
          minRotation: 0,
          autoSkip: false,
          font: { size: 10 }
        }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const doughnutData = {
    labels: shortNames,
    datasets: [
      {
        label: 'Tỷ lệ công việc (%)',
        data: stats.companyStats.map(c => c.percent),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-center text-2xl font-extrabold text-blue-700 mb-10">📊 Thống kê Nhà Tuyển Dụng</h1>

      <div className="flex justify-center gap-4 mb-10">
        <input type="number" value={month} onChange={e => setMonth(e.target.value)} placeholder="Tháng (1-12)"
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 outline-none" />
        <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Năm (vd: 2025)"
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200 outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-blue-600">Tổng số công việc</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-semibold text-center text-gray-800">{stats.totalJobs}</p></CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-blue-600">Tổng lượt xem</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-semibold text-center text-gray-800">{stats.totalViews}</p></CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <Card className="bg-white shadow-md rounded-2xl">
            <CardHeader><CardTitle className="text-blue-600">Tỷ lệ công việc theo công ty</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-60 mx-auto">
                <Doughnut data={doughnutData} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-2xl">
            <CardHeader><CardTitle className="text-blue-600">Số lượng công việc theo công ty</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64 w-full overflow-x-auto">
                <Bar data={barData} options={barOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-blue-600">Tỉ lệ ứng viên</CardTitle></CardHeader>
          <CardContent className="text-gray-700 text-lg space-y-1">
            <p>✅ Đã xác nhận: <strong>{stats.acceptedPercent}%</strong></p>
            <p>❌ Đã bị hủy: <strong>{stats.rejectedPercent}%</strong></p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-blue-600">Việc xem nhiều nhất</CardTitle></CardHeader>
          <CardContent className="text-gray-800">
            <p className="font-medium">{stats.mostViewedJob?.title || 'Không có dữ liệu'}</p>
            <p className="text-sm text-gray-500">{stats.mostViewedJob?.views || 0} lượt xem</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-blue-600">Việc nhiều ứng viên nhất</CardTitle></CardHeader>
          <CardContent className="text-gray-800">
            {stats.jobWithMostApplicants?.applicants > 0 ? (
              <>
                <p className="font-medium">{stats.jobWithMostApplicants.title}</p>
                <p className="text-sm text-gray-500">{stats.jobWithMostApplicants.applicants} ứng viên</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Chưa có ứng viên ứng tuyển</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 bg-white shadow-md rounded-2xl">
          <CardHeader><CardTitle className="text-blue-600">Top kỹ năng được yêu cầu</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {stats.topSkills.map(skill => (
                <li key={skill.name}><strong>{skill.name}</strong> ({skill.count})</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerStatistics;
