import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { TechSkill } from "../models/techskill.model.js";

export const getEmployerStatistics = async (req, res) => {
  try {
    const userId = req.id;
    const { month, year } = req.query;

    // Get all companies of this employer
    const companies = await Company.find({ userId }).populate('jobCount');
    const companyIds = companies.map(c => c._id);

    // Optional filter by month/year
    let timeFilter = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      timeFilter = { createdAt: { $gte: start, $lte: end } };
    }

    // Get jobs of these companies
    const jobs = await Job.find({ company: { $in: companyIds }, ...timeFilter })
      .populate('requiredSkills applications');

    const totalJobs = jobs.length;
    const companyStats = companies.map(company => {
      const jobCount = jobs.filter(j => j.company.toString() === company._id.toString()).length;
      const percent = totalJobs > 0 ? parseFloat(((jobCount / totalJobs) * 100).toFixed(2)) : 0;

      return {
        name: company.name,
        jobCount,
        percent
      };
    });

    const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
    const mostViewedJob = jobs.reduce((max, job) => job.views > max.views ? job : max, jobs[0]);
    const jobWithMostApplicants = jobs.reduce((max, job) =>
      job.applications.length > max.applications.length ? job : max, jobs[0]);

    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } });
    const totalApps = applications.length;
    const accepted = applications.filter(app => app.status === "Đã xác nhận").length;
    const rejected = applications.filter(app => app.status === "Đã bị hủy").length;

    const acceptedPercent = totalApps > 0 ? ((accepted / totalApps) * 100).toFixed(2) : 0;
    const rejectedPercent = totalApps > 0 ? ((rejected / totalApps) * 100).toFixed(2) : 0;

    const skillMap = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillMap[skill.name] = (skillMap[skill.name] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      companyStats,
      totalJobs,
      totalViews,
      mostViewedJob: mostViewedJob ? {
        id: mostViewedJob._id,
        title: mostViewedJob.title,
        views: mostViewedJob.views
      } : null,
      jobWithMostApplicants: jobWithMostApplicants ? {
        id: jobWithMostApplicants._id,
        title: jobWithMostApplicants.title,
        applicants: jobWithMostApplicants.applications.length
      } : null,
      acceptedPercent,
      rejectedPercent,
      topSkills
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi tính thống kê." });
  }
};

export const getAdminStatistics = async (req, res) => {
  try {
    const totalApplicants = await User.countDocuments({ role: 'Ứng viên' });
    const totalEmployers = await User.countDocuments({ role: 'Nhà tuyển dụng' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const skillCategories = await TechSkill.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);
    const usedSkills = await Job.aggregate([
      { $unwind: "$requiredSkills" },
      {
        $group: {
          _id: "$requiredSkills",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "techskills",
          localField: "_id",
          foreignField: "_id",
          as: "skill"
        }
      },
      { $unwind: "$skill" },
      {
        $project: {
          _id: 0,
          name: "$skill.name",
          category: "$skill.category",
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const totalSkillUsage = usedSkills.reduce((sum, skill) => sum + skill.count, 0);

    const skillUsagePercent = usedSkills.map(skill => ({
      name: skill.name,
      category: skill.category,
      count: skill.count,
      percent: ((skill.count / totalSkillUsage) * 100).toFixed(2)
    }));

    const topViewedCompanies = await Company.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name views');

    const topViewedJobs = await Job.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views');

    const topAppliedJobs = await Job.aggregate([
      {
        $project: {
          title: 1,
          applicantCount: { $size: "$applications" }
        }
      },
      { $sort: { applicantCount: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      totalApplicants,
      totalEmployers,
      totalCompanies,
      totalJobs,
      skillCategories,
      skillUsagePercent,
      topViewedCompanies,
      topViewedJobs,
      topAppliedJobs
    });
  } catch (error) {
    console.error("Lỗi thống kê admin:", error);
    res.status(500).json({ error: "Lỗi thống kê quản trị viên." });
  }
};
