import React, { useState } from 'react';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '../ui/table.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';
import { Dialog, DialogContent } from '../ui/dialog.jsx';
import { Button } from '../ui/button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { Eye, Calendar, Trash2 } from 'lucide-react';
import {
  APPLICATION_API_END_POINT,
  CV_API_END_POINT
} from '@/utills/constant.js';
import {
  setAllApplicants,
  updateApplicationStatus,
  updateInterviewDate
} from '@/redux/applicationSlice.js';
import ReadOnlyCV from './ReadOnlyCV.jsx';
import FormatApplyDate from '../FormatApplyDate.jsx';
import { setSingleJob } from '@/redux/jobSlice.js';

const statusOptions = [
  { label: "Chấp nhận", value: "Đã xác nhận", color: "text-green-600 bg-green-100 hover:bg-green-200" },
  { label: "Từ chối", value: "Đã bị hủy", color: "text-red-600 bg-red-100 hover:bg-red-200" }
];

const EmployerApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);
  const { singleJob } = useSelector(store => store.job);
  const dispatch = useDispatch();

  const [selectedCV, setSelectedCV] = useState(null);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState(null);

  const fetchCV = async (cvId) => {
    try {
      const res = await axios.get(`${CV_API_END_POINT}/get/${cvId}`, { withCredentials: true });
      setSelectedCV(res.data.cv);
      setOpenDialog(true);
    } catch (err) {
      toast.error("Không thể tải CV");
    }
  };

  const interviewHandler = async () => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/schedule/${selectedApplicationId}`, {
        interviewDate,
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateInterviewDate({
          id: selectedApplicationId,
          interviewDate
        }));
        setOpenScheduleDialog(false);
        setInterviewDate('');
      }
    } catch (err) {
      toast.error("Lỗi khi lên lịch");
    }
  };

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateApplicationStatus({ id, status }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteApplicant = async () => {
    if (!applicantToDelete) return;

    try {
      const res = await axios.delete(`${APPLICATION_API_END_POINT}/delete/${applicantToDelete._id}`, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedApplications = applicants.applications.filter(app => app._id !== applicantToDelete._id);
        dispatch(setAllApplicants({ applications: updatedApplications }));
        dispatch(setSingleJob({
          ...singleJob,
          applications: singleJob.applications.filter(app => app._id !== applicantToDelete._id)
        }));
      }
    } catch (error) {
      console.error("Lỗi khi xóa ứng viên:", error);
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setOpenDeleteDialog(false);
      setApplicantToDelete(null);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableCaption className="text-xs">Danh sách những người đã ứng tuyển</TableCaption>
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Hồ sơ</TableHead>
              <TableHead>Ngày ứng tuyển</TableHead>
              <TableHead>Ngày phỏng vấn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants?.applications?.map((item) => (
              <TableRow key={item._id} className="flex flex-col md:table-row border md:border-0 p-4 md:p-0 rounded-xl mb-4 md:mb-0 shadow-sm md:shadow-none">
                <TableCell className="font-medium md:table-cell">
                  <span className="md:hidden font-semibold">Họ và tên: </span>{item?.applicant?.fullname}
                </TableCell>
                <TableCell className="md:table-cell">
                  <span className="md:hidden font-semibold">Email: </span>{item?.applicant?.email}
                </TableCell>
                <TableCell className="md:table-cell">
                  <span className="md:hidden font-semibold">Liên hệ: </span>{item?.applicant?.phoneNumber}
                </TableCell>
                <TableCell className="md:table-cell">
                  <span className="md:hidden font-semibold">Hồ sơ: </span>
                  {item?.applicant?.cvId ? (
                    <div onClick={() => fetchCV(item.applicant.cvId)} className="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer">
                      <Eye className="w-4 h-4 mr-1" /> Xem CV
                    </div>
                  ) : "Không có"}
                </TableCell>
                <TableCell className="md:table-cell">
                  <span className="md:hidden font-semibold">Ngày ứng tuyển: </span>{FormatApplyDate(item?.createdAt)}
                </TableCell>
                <TableCell className="md:table-cell">
                  <span className="md:hidden font-semibold">Ngày phỏng vấn: </span>
                  {item?.interviewDate ? (
                    <span>{new Date(item.interviewDate).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}</span>
                  ) : item.status === "Đã xác nhận" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplicationId(item._id);
                        setOpenScheduleDialog(true);
                      }}
                      className="rounded-xl mt-2 md:mt-0"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Lên lịch
                    </Button>
                  ) : (
                    <span className="text-sm italic text-gray-500">Chưa chấp nhận</span>
                  )}
                </TableCell>
                <TableCell className="md:table-cell">
                  <span className="md:hidden font-semibold">Trạng thái: </span>
                  <Popover
                    open={openPopoverId === item._id}
                    onOpenChange={(v) => setOpenPopoverId(v ? item._id : null)}
                  >
                    <PopoverTrigger>
                      <span className={`px-3 py-2 rounded-xl text-sm font-medium cursor-pointer ${item.status === "Đã xác nhận"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Đã bị hủy"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                        }`}>
                        {item.status === "Đã xác nhận"
                          ? "Đã chấp nhận"
                          : item.status === "Đã bị hủy"
                            ? "Đã từ chối"
                            : "Chờ xử lý"}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2 mt-2">
                      {statusOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            statusHandler(option.value, item._id);
                            setOpenPopoverId(null);
                          }}
                          className={`flex items-center gap-2 px-2 py-2 my-2 w-full rounded-xl transition text-sm font-medium cursor-pointer ${option.color}`}
                        >
                          {option.label}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-right md:table-cell mt-2 md:mt-0">
                  <div className="flex justify-end">
                    <div
                      onClick={() => {
                        setApplicantToDelete(item);
                        setOpenDeleteDialog(true);
                      }}
                      className="flex text-red-500 items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>Xóa</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog xem CV */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
          <ReadOnlyCV cv={selectedCV} />
        </DialogContent>
      </Dialog>

      {/* Dialog lên lịch phỏng vấn */}
      <Dialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
        <DialogContent className="max-w-md bg-white text-black p-6">
          <h3 className="text-lg font-semibold mb-4">Lên lịch phỏng vấn</h3>
          <label className="block mb-2 text-sm font-medium">Chọn ngày giờ:</label>
          <input
            type="datetime-local"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-md mb-4"
          />
          <Button
            onClick={interviewHandler}
            className='rounded-xl bg-blue-600 hover:bg-blue-300'
          >
            Xác nhận
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xoá */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="max-w-md bg-white text-black p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Xác nhận xoá ứng viên</h3>
          <p className="mb-6">
            Bạn có chắc chắn muốn xoá ứng viên <strong>{applicantToDelete?.applicant?.fullname}</strong> không?
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" className='rounded' onClick={() => setOpenDeleteDialog(false)}>
              Huỷ
            </Button>
            <Button
              onClick={confirmDeleteApplicant}
              className='bg-red-600 text-white hover:bg-red-500 rounded'
            >
              Xoá
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerApplicantsTable;
