import html2pdf from 'html2pdf.js';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CV_API_END_POINT } from '@/utills/constant';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/uiSlice';
import CVRenderer from './CVRenderer';
import { setCV } from '@/redux/cvSlice';
import { updateUserProfile } from '@/redux/authSlice';

const MyCV = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [myCV, setMyCV] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deletingId, setDeletingId] = useState(null); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const [cvToDelete, setCVToDelete] = useState(null);

  const params = useParams();
  const cvId = params.id;
  const resumeRef = useRef();

  const exportPDFHandler = () => {
    setIsExporting(true);
    if (!resumeRef.current) return;

    const element = resumeRef.current;
    const options = {
      margin: 0.3,
      filename: 'my_cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf()
    .set(options)
    .from(element)
    .save()
    .finally(() => setIsExporting(false));
  };
 

  const handleNavigate = (path) => {
    dispatch(startLoading());
    window.location.href = (path);
  };

  const confirmRemoveCV = (cv) => {
    setCVToDelete(cv);
    setShowConfirmDialog(true);
  };

  const deleteCVHandler = async () => {
    if(!cvToDelete) return;

    const cvId = cvToDelete._id;
    setDeletingId(cvId);
    setShowConfirmDialog(false);

    try {
      const res = await axios.delete(`${CV_API_END_POINT}/delete-cv/${cvId}`, { withCredentials: true });

      if(res.data.success){
        dispatch(setCV(null)); 
        dispatch(updateUserProfile({ cvId: null }));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi xóa CV:", error);
    } finally {
      setDeletingId(null); 
      setCVToDelete(null);
    }
  };

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await axios.get(`${CV_API_END_POINT}/get/${cvId}`, { withCredentials: true });
        setMyCV(res.data.cv);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, [cvId]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(stopLoading());
    }, 800)
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Đang tải CV...</p>;
  if (!myCV) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <img
          src="/assets/nocv.jpg"
          alt="No CV"
          className="w-40 h-40 rounded mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Bạn chưa có CV nào!</h2>
        <p className="text-gray-500 mb-6">Tạo một bản CV chuyên nghiệp chỉ trong vài phút.</p>
        <Link
          to="/create-cv"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Tạo Hồ sơ & CV ngay
        </Link>
        <span className="text-sm text-blue-600 mt-4" onClick={() => handleNavigate("/")}>Quay lại Trang chủ</span>
      </div>
    );
  }
  

  return (
    <div className="font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex items-center justify-center dark:text-gray-100">
          <Button
            type="button"
            onClick={() => handleNavigate("/")}
            className="absolute left-0 flex items-center gap-2"
          >
            <ArrowLeft />
          </Button>
          <h1 className="font-bold text-xl text-center pt-4">Hồ Sơ - CV Cá Nhân</h1>
        </div>
        <div className="border-b-2 border-gray-300 my-4"></div>

        <CVRenderer template={myCV.template} cv={myCV} resumeRef={resumeRef} />

        <div className="flex justify-center items-center gap-3 my-5">
          <Button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={exportPDFHandler} 
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Tải file PDF
          </Button>
          <Button
            type="button"
            onClick={() => handleNavigate(`/update-cv/${cvId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
              Chỉnh sửa
          </Button>
          <Button
            type="button"
            onClick={() => confirmRemoveCV(myCV)}
            variant='ghost'
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            title="Xóa hồ sơ - CV" 
            disabled={deletingId === myCV._id}
          >
            Xóa CV
          </Button>
        </div>
        
        <div className="h-10"></div> 

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 opacity-100">
            <DialogHeader>
                <DialogTitle className="text-gray-900">Xác nhận xóa</DialogTitle>
                <DialogDescription className="text-gray-700">
                    Bạn có chắc chắn muốn xóa hồ sơ - CV cá nhân không?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" className="rounded hover:bg-gray-300"  onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
                <Button variant="destructive" className="rounded text-red-600 hover:bg-red-300" onClick={deleteCVHandler} disabled={deletingId !== null}> 
                     {deletingId ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Xóa
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyCV;
