import React, { useEffect, useState } from 'react';
import { Eye, Globe, MapPin, Phone, Plus, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { COMPANY_API_END_POINT, USER_API_END_POINT } from '@/utills/constant';
import JobByCompany from './JobByCompany';
import MapView from './MapView';
import { Button } from './ui/button';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { setSingleCompany } from '@/redux/companySlice';
import socket from '@/lib/socket';
import { stopLoading } from '@/redux/uiSlice';

const CompanyDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const companyId = params.id;
  useGetCompanyById(companyId);

  const {singleCompany} = useSelector(store => store.company);
  const { user } = useSelector(store => store.auth);

  const [jobByCompany, setJobByCompany] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(user?.followCompanies?.includes(companyId));
  }, [user, companyId]);

  const toggleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isFollowing ? 'delete' : 'post';
      const url = `${USER_API_END_POINT}/${isFollowing ? 'unfollow' : 'follow'}/${companyId}`;
      const res = await axios[method](url, isFollowing ? {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      } : {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (res.data.success) {
        const updateFollow = isFollowing
          ? user.followCompanies.filter(id => id !== companyId)
          : [...(user.followCompanies || []), companyId];
        dispatch(setUser({ ...user, followCompanies: updateFollow }));
        setIsFollowing(!isFollowing);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  }

  useEffect(() => {
    const fecthJobByCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/${companyId}/jobs`, {
          withCredentials: true,
        });

        if(res.data.success){
          setJobByCompany(res.data.jobs);
        }else {
          toast.error(res.data.message || "Lỗi khi lấy danh sách công việc của công ty.");
          setJobByCompany([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fecthJobByCompany();
  }, []);

  useEffect(() => {
    const onCompanyUpdated = (companyId) => {
      dispatch(setSingleCompany(companyId));
    };
    
    socket.on("company_updated", onCompanyUpdated);

    return () => {
      socket.off("company_updated", onCompanyUpdated);
    }
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800);
  });

  return (
    <div className='max-w-6xl mx-auto py-8'>
      <div className='p-3 rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 group'>
        <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-inner mb-2">
          {singleCompany?.background ? (
            <img
              src={singleCompany.background}
              alt={`${singleCompany.name} background`}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-semibold">
              Ảnh bìa chưa có
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <img
            src={singleCompany?.logo || 'https://via.placeholder.com/96x96?text=Logo'}
            alt={singleCompany?.name}
            className="w-28 h-28 rounded-xl object-cover border-2 border-white shadow-md -mt-16 sm:mt-0 bg-white"
          />
          <div className='flex-grow'>
            <h2 className='font-bold text-lg sm:text-xl text-[#003699] mb-2 transition-colors'>
              {singleCompany?.name || 'Tên công ty'}
            </h2>
            <div className="flex flex-wrap items-center text-sm text-gray-600 font-medium gap-x-6 gap-y-2">
              <div className="flex items-center">
                <MapPin size={14} className="mr-2" />
                <span>{singleCompany?.location || 'Địa chỉ công ty'}</span>
              </div>
              <div className="flex items-center">
                <Globe size={14} className="mr-2" />
                {singleCompany?.website ? (
                  <Link to={singleCompany.website} className="hover:underline text-blue-600" target="_blank">
                    Trang web công ty
                  </Link>
                ) : (
                  <span>Chưa có website</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:ml-auto gap-2 mt-4 sm:mt-0">
            <div className="flex items-center gap-1 text-gray-600 text-sm font-medium">
              <Eye size={16} />
              <span>{singleCompany?.followerCount || '1.4k'} người theo dõi</span>
            </div>
            <Button 
              onClick={toggleFollow}
              disabled={!user}
              className={`rounded transition-all duration-300 ${
                isFollowing
                  ? 'bg-[#F83002] hover:bg-red-600 text-white'
                  : 'bg-blue-700 hover:bg-blue-500 text-white'
              }`}
            >
              {isFollowing ? <><X size={16}/> Bỏ theo dõi</> : <><Plus size={16} /> Theo dõi</>}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 my-2">Vị trí đang tuyển ({jobByCompany.length})</h1>
        <div className='flex-1 overflow-y-auto py-5'>
          {
            jobByCompany.length === 0 ? (
            <p className='text-center text-gray-500'>Không có công việc nào đang tuyển của công ty này.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobByCompany?.map((job) => (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <JobByCompany key={job._id} job={job} />
                </div>
              ))}
            </div>
            )
          }
        </div>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Giới thiệu công ty</h1>
        <div className="text-lg ml-4 space-y-1 my-2">
          {singleCompany?.description?.split('\n').map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Lĩnh vực hoạt động của công ty</h1>
          <div className="text-lg ml-4 space-y-1 my-2">
              {singleCompany?.field?.split('\n').map((item, index) => (
                  <div key={index}>{item}</div>
              ))}
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Liên hệ</h1>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-300 overflow-hidden">
            <MapView address={singleCompany?.address} />
          </div>

          <div className="flex-1 md:w-1/2 text-sm space-y-4">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-700 dark:text-gray-100 mt-1" />
              <div>
                <div className="font-semibold">Địa chỉ:</div>
                <p className="text-gray-700 dark:text-gray-100">{singleCompany?.address || 'Địa chỉ công ty'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone size={16} className="text-gray-700 dark:text-gray-100 mt-1" />
              <div>
                <div className="font-semibold">Liên hệ: </div>
                <p className="text-gray-700 dark:text-gray-100">{singleCompany?.hotline || 'Hotline công ty'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default CompanyDetail;