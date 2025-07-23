import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import Sidebar from "../shared/Sidebar.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.jsx";
import { Button } from "../ui/button.jsx";

import { JOB_API_END_POINT } from "@/utills/constant";
import { setAllJobs, setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import FormatApplyDate from "../FormatApplyDate.jsx";
import { AlertCircle, ArrowLeftCircle, ArrowRightCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog.jsx";
import ReadJobDetails from "../employer/ReadJobDetails.jsx";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.jsx";

const PostManager = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const { allJobs } = useSelector((store) => store.job);
  useGetAllJobs();

  const [openDialog, setOpenDialog] = useState(false);
  const [job, setJob] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const fetchJob = async (jobId) => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get-job/${jobId}`, { withCredentials: true });
            console.log(res.data);
            
            setJob(res.data.job);
            setOpenDialog(true);
        } catch (err) {
            toast.error("Không thể tải thông tin công việc");
        }
    };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    dispatch(setSearchedQuery(e.target.value));
  };

  const filteredJobs = (allJobs || []).filter(
    (job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / limit);
  const paginatedJobs = filteredJobs.slice((page - 1) * limit, page * limit);

  const openDeleteConfirm = (job) => {
    setJobToDelete(job);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!jobToDelete) return;

    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobToDelete._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedPostJobs = allJobs.filter((job) => job._id !== jobToDelete._id);
        toast.success(res.data.message);
        dispatch(setAllJobs(updatedPostJobs));
      }
    } catch (error) {
      console.error("Xóa bài đăng thất bại:", error);
      toast.error("Đã xảy ra lỗi khi xóa bài đăng.");
    } finally {
      setOpenDeleteDialog(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10">
        <h2 className="text-2xl font-semibold mb-2">Quản lý bài đăng</h2>
        <p className="text-gray-600">Theo dõi và duyệt các bài đăng tuyển dụng.</p>

        <div className="flex flex-wrap items-center gap-4 my-4">
          <input
            type="text"
            placeholder="Lọc bài đăng theo tên công việc, tên công ty"
            value={search}
            onChange={handleSearch}
            className="p-2 border rounded w-64"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">
            Danh sách bài đăng ({filteredJobs.length})
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Tên công việc</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, index) => (
                  <TableRow key={job._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company?.name || "Không rõ"}</TableCell>
                    <TableCell>{FormatApplyDate(job.createdAt)}</TableCell>
                    <TableCell>{FormatApplyDate(job.duration)}</TableCell>
                    <TableCell>
                      <div onClick={() => fetchJob(job._id)} className='w-10 gap-2 px-2 py-2 ml-2 cursor-pointer'>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => openDeleteConfirm(job)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Xóa</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="text-center text-gray-500">
                    Không có bài đăng nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-end mt-4 gap-2">
              <Button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <ArrowLeftCircle />
              </Button>
              <span className="px-4 py-2 text-sm font-medium">
                Trang {page}/{totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                <ArrowRightCircle />
              </Button>
            </div>
          )}
        </div>
        {/* Dialog xác nhận xóa */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="max-w-md p-6 rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn xóa bài đăng này?
            </h3>
            <p className="mb-6">
              Tiêu đề: <strong>{jobToDelete?.title}</strong>
              <br />
              Công ty: <strong>{jobToDelete?.company?.name || "Không rõ"}</strong>
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" className='rounded' onClick={() => setOpenDeleteDialog(false)}>
                Hủy
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded" onClick={handleDeleteConfirmed}>
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
            <ReadJobDetails job={job} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PostManager;
