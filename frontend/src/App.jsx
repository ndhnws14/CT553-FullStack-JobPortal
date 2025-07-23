import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/shared/Layout.jsx';
import Login from './components/auth/login.jsx';
import Signup from './components/auth/signup.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';
import Home from './components/home/Home.jsx';
import Jobs from './components/Jobs.jsx';
import Browse from './components/home/Browse.jsx';
import Profile from './components/profile/Profile.jsx';
import JobDescription from './components/JobDescription.jsx';
import SavedJobs from './components/SavedJobs.jsx';
import LovedJobs from './components/LovedJobs.jsx';
import CreateCV from './components/cv/CreateCV.jsx';
import CVSetup from './components/cv/CVSetup.jsx';
import MyCV from './components/cv/MyCV.jsx';
import CVUpdate from './components/cv/CVUpdate.jsx';
import Companies from './components/Companies.jsx';
import CareerGuide from './components/guide/CareerGuide.jsx';
import DinhHuong from './components/guide/DinhHuong.jsx';
import VietCV from './components/guide/VietCV.jsx';
import PhongVan from './components/guide/PhongVan.jsx';
import KyNangMem from './components/guide/KyNangMem.jsx';
import TimViec from './components/guide/TimViec.jsx';
import HanhTrang from './components/guide/HanhTrang.jsx';
import FullPageLoader from './components/loaders/FullPageLoader.jsx';
import RecommendBySkills from './components/RecommendBySkills.jsx';
import RecommendByUserBehavior from './components/RecommendByUserBehavior.jsx';

import HomePageEmployer from './components/employer/HomePageEmployer.jsx';
import PostJob from './components/employer/PostJob.jsx';
import ProtectedRoute from './components/employer/ProtectedRoute.jsx';
import CompanyDetail from './components/CompanyDetail.jsx';
import EmployerCompanies from './components/employer/EmployerCompanies.jsx';
import EmployerCompanyCreate from './components/employer/EmployerCompanyCreate.jsx';
import EmployerCompanySetup from './components/employer/EmployerCompanySetup.jsx';
import EmployerJobs from './components/employer/EmployerJobs.jsx';
import EmployerJobUpdate from './components/employer/EmployerJobUpdate.jsx';
import EmployerApplicants from './components/employer/EmployerApplicants.jsx';
import EmployerProfile from './components/employer/EmployerProfile.jsx';
import EmployerStatistics from './components/employer/EmployerStatistics.jsx';

import AdmindRoute from './components/admin/AdminRoute.jsx';
import AdminHome from './components/admin/AdminHome.jsx';
import SkillManager from './components/admin/SkillManager.jsx';
import AccountManager from './components/admin/AccountManager.jsx';
import CompanyManager from './components/admin/CompanyManager.jsx';
import PostManager from './components/admin/PostManager.jsx';
import AdminStatistics from './components/admin/AdminStatistics.jsx';
import Level from './components/admin/Level.jsx';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import socket from './lib/socket.js';
import { addNotification } from './redux/notificationSlice.js';
import { TooltipProvider } from './components/ui/tooltip.jsx';
import ViewChatbot from './components/chatbot/ViewChatbot.jsx';

const appRouter = createBrowserRouter([
  //user
  {
    path:'/',
    element: (
      <Layout><Home/></Layout>
    )
  },
  {
    path:'/login',
    element: (
      <Layout><Login/></Layout>
    )
  },
  {
    path:'/register',
    element: (
      <Layout><Signup/></Layout>
    )
  },
  {
    path:'/reset-password',
    element: (
      <Layout><ResetPassword/></Layout>
    )
  },
  {
    path:'/jobs',
    element: (
      <Layout><Jobs /></Layout>
    )
  },
  {
    path:'/recommend-by-skills',
    element: (
      <Layout><RecommendBySkills /></Layout>
    )
  },
  {
    path:'/recommend-collab',
    element: (
      <Layout><RecommendByUserBehavior /></Layout>
    )
  },
  {
    path:'/description/:id',
    element:<JobDescription />
  },
  {
    path:'/companies',
    element: (
      <Layout><Companies /></Layout>
    )
  },
  {
    path:'/company-detail/:id',
    element: (
      <Layout><CompanyDetail /></Layout>
    )
  },
  {
    path:'/guide',
    element: (
      <Layout><CareerGuide /></Layout>
    )
  },
  {
    path:'/guide/dinh-huong',
    element: (
      <Layout><DinhHuong /></Layout>
    )
  },
  {
    path:'/guide/viet-cv',
    element: (
      <Layout><VietCV /></Layout>
    )
  },
  {
    path:'/guide/phong-van',
    element: (
      <Layout><PhongVan /></Layout>
    )
  },
  {
    path:'/guide/ky-nang-mem',
    element: (
      <Layout><KyNangMem /></Layout>
    )
  },
  {
    path:'/guide/tim-viec',
    element: (
      <Layout><TimViec /></Layout>
    )
  },
  {
    path:'/guide/hanh-trang',
    element: (
      <Layout><HanhTrang /></Layout>
    )
  },
  {
    path:'/browse',
    element: (
      <Layout><Browse /></Layout>
    )
  },
  {
    path:'/create-cv',
    element: (
      <Layout><CreateCV /></Layout>
    )
  },
  {
    path:'/create-cv-setup',
    element: (
      <Layout><CVSetup /></Layout>
    )
  },
  {
    path:'/profile',
    element: (
      <Layout><Profile /></Layout>
    )
  },
  {
    path:'/my-cv/:id',
    element: <MyCV />
  },
  {
    path:'/update-cv/:id',
    element: (
      <Layout><CVUpdate /></Layout>
    )
  },
  {
    path:'/saved-jobs',
    element: <SavedJobs />
  },
  {
    path:'/loved-jobs',
    element: <LovedJobs />
  },
  //employer recruiter
  {
    path:'/recruiter/',
    element: <ProtectedRoute><Layout><HomePageEmployer /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/companies',
    element: <ProtectedRoute><Layout><EmployerCompanies /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/companies/create',
    element: <ProtectedRoute><Layout><EmployerCompanyCreate /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/companies/:id',
    element: <ProtectedRoute><Layout><EmployerCompanySetup /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/jobs',
    element: <ProtectedRoute><Layout><EmployerJobs /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/jobs/create',
    element: <ProtectedRoute><Layout><PostJob /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/jobs/:id',
    element: <ProtectedRoute><Layout><EmployerJobUpdate /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/jobs/:id/applicants',
    element: <ProtectedRoute><Layout><EmployerApplicants /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/profile',
    element: <ProtectedRoute><Layout><EmployerProfile /></Layout></ProtectedRoute>
  },
  {
    path:'/recruiter/statistics',
    element: <ProtectedRoute><Layout><EmployerStatistics /></Layout></ProtectedRoute>
  },
  //admin
  {
    path:'/admin',
    element: <AdmindRoute><AdminHome /></AdmindRoute>
  },
  {
    path:'/admin/skills',
    element: <AdmindRoute><SkillManager /></AdmindRoute>
  },
  {
    path:'/admin/accounts',
    element: <AdmindRoute><AccountManager /></AdmindRoute>
  },
  {
    path:'/admin/companies',
    element: <AdmindRoute><CompanyManager /></AdmindRoute>
  },
  {
    path:'/admin/posts',
    element: <AdmindRoute><PostManager /></AdmindRoute>
  },
  {
    path:'/admin/stats',
    element: <AdmindRoute><AdminStatistics /></AdmindRoute>
  },
  {
    path:'/admin/level',
    element: <AdmindRoute><Level /></AdmindRoute>
  },
])

function App() {
  const { user } = useSelector(store => store.auth);
  const {loading} = useSelector(store => store.ui);
  const dispatch = useDispatch();
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (!user?._id) return;

    if (!hasRegistered.current) {
      socket.emit("register", user._id);
      hasRegistered.current = true;
    }

    const onNewNotification = (data) => {
      dispatch(addNotification({ ...data, isRead: false }));
      toast(data.message);
    };

    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("new_notification", onNewNotification);
    };
  }, [user?._id, dispatch]);

  return (
    <div className="bg-background text-foreground dark:bg-zinc-900 dark:text-white min-h-screen transition-all">
      {loading && <FullPageLoader />}
      <TooltipProvider>
        <RouterProvider router={appRouter}/>
        {user?.role !== "Quản trị viên" && <ViewChatbot />}
      </TooltipProvider>
    </div>
  )
}

export default App;
