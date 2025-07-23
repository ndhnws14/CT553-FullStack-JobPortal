import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Sidebar from "../shared/Sidebar";
import { STATISTICS_API_END_POINT } from '@/utills/constant';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminStatistics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${STATISTICS_API_END_POINT}/admin`, { withCredentials: true });
        setStats(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy thống kê admin:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="text-center">Đang tải thống kê...</p>;

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f87171', '#22d3ee', '#a78bfa',
    '#34d399', '#fb7185', '#60a5fa', '#fbbf24', '#c084fc',
    '#f43f5e', '#2dd4bf', '#f97316', '#818cf8', '#f43f5e'
  ];
  //
  const skillCategoryData = {
    labels: stats.skillCategories.map(s => s._id),
    datasets: [
      {
        label: 'Số lượng kỹ năng',
        data: stats.skillCategories.map(s => s.count),
        backgroundColor: stats.skillUsagePercent.map((_, idx) => colors[idx % colors.length]),
      }
    ]
  };
  const categoryBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        ticks: {
          font: { size: 10 },
          maxRotation: 20,
          minRotation: 0,
          autoSkip: false
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} kỹ năng`
        }
      }
    }
  }; 
  //
  const usedSkillsData = {
    labels: stats.skillUsagePercent.map(s => s.name.length > 20 ? s.name.slice(0, 20) + '...' : s.name),
    datasets: [
      {
        label: 'Tỷ lệ sử dụng kỹ năng (%)',
        data: stats.skillUsagePercent.map(s => s.percent),
        backgroundColor: stats.skillUsagePercent.map((_, idx) => colors[idx % colors.length]),
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + '%'
        }
      },
      x: {
        ticks: {
          display: true
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };
  //
  const labels = [
    ...stats.topViewedCompanies.map(c => c.name),
    ...stats.topViewedJobs.map(j => j.title)
  ];
  const companyViews = stats.topViewedCompanies.map(c => c.views);
  const jobViews = stats.topViewedJobs.map(j => j.views);
  const viewChartData = {
    labels,
    datasets: [
      {
        label: 'Lượt xem công ty',
        data: [...companyViews, ...Array(jobViews.length).fill(null)],
        backgroundColor: 'rgba(59, 130, 246, 0.7)'
      },
      {
        label: 'Lượt xem công việc',
        data: [...Array(companyViews.length).fill(null), ...jobViews],
        backgroundColor: 'rgba(16, 185, 129, 0.7)'
      }
    ]
  };
  const viewChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Top công ty & công việc theo lượt xem'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        ticks: {
          display: false
        },
      }
    }
  };
  //
  const appliedJobsData = {
    labels: stats.topAppliedJobs.map(job => job.title.length > 20 ? job.title.slice(0, 20) + '...' : job.title),
    datasets: [
      {
        label: "Số lượng ứng viên",
        data: stats.topAppliedJobs.map(job => job.applicantCount),
        backgroundColor: "#10b981",
        borderRadius: 6,
        barThickness: 30
      }
    ]
  };
  const appliedJobsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          callback: (value) => value
        }
      },
      x: {
        ticks: {
          font: { size: 10 },
          maxRotation: 20,
          minRotation: 0,
          autoSkip: false
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100 text-gray-800">
      <Sidebar/>
      <main className="flex-1 p-10 md:p-12 space-y-12 overflow-x-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2 tracking-wide">📊 Thống kê Hệ thống (Quản trị viên)</h1>
          <p className="text-gray-600 text-base max-w-xl">
            Tổng quan số liệu về người dùng, bài đăng, công ty và kỹ năng...
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: "Ứng viên", value: stats.totalApplicants },
            { title: "Nhà tuyển dụng", value: stats.totalEmployers },
            { title: "Công ty", value: stats.totalCompanies },
            { title: "Bài đăng việc làm", value: stats.totalJobs }
          ].map(({ title, value }) => (
            <Card key={title} className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-700">{title}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xl font-bold text-blue-600 text-center">{value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">🎯 Phân bố kỹ năng theo danh mục</CardTitle>
            </CardHeader>
            <CardContent className="p-6 min-h">
              <Bar data={skillCategoryData} options={categoryBarOptions} />
            </CardContent>
          </Card>

          <Card className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">📈Top kỹ năng - công nghệ yêu cầu trong bài đăng (%)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 min-h overflow-x-auto">
              <Bar data={usedSkillsData} options={barOptions} />
            </CardContent>
          </Card>

          <Card className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">👀Top lượt xem công ty & công việc</CardTitle>
            </CardHeader>
            <CardContent className="p-6 min-h">
              <Bar data={viewChartData} options={viewChartOptions} />
            </CardContent>
          </Card>

          <Card className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">👥 Top công việc có nhiều ứng viên nhất</CardTitle>
            </CardHeader>
            <CardContent className="p-6 min-h overflow-x-auto">
              <Bar data={appliedJobsData} options={appliedJobsOptions} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AdminStatistics;