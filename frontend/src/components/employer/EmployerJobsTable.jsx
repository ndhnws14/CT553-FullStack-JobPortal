import React, { useEffect, useState } from 'react';
import { AlertCircle, Circle, Edit2, Eye, MoreHorizontal, Sparkles, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';
import { useNavigate } from 'react-router-dom';
import { setAllAdminJobs } from '@/redux/jobSlice.js';
import { toast } from 'sonner';
import { JOB_API_END_POINT } from '@/utills/constant.js';
import axios from 'axios';
import FormatApplyDate from '../FormatApplyDate.jsx';
import ReadJobDetails from './ReadJobDetails.jsx';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog.jsx';
import DaysAgo from '../DaysAgo.jsx';
import RecommendCandidates from './RecommendCandidates.jsx';

const EmployerJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);

    const [openDialog, setOpenDialog] = useState(false);
    const [job, setJob] = useState(null);
    const [showRecommend, setShowRecommend] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchJob = async (jobId) => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get-job/${jobId}`, { withCredentials: true });
            setJob(res.data.job);
            setOpenDialog(true);
        } catch (err) {
            toast.error("Không thể tải thông tin công việc");
        }
    };

    const confirmDeleteJob = async () => {
        if (!jobToDelete) return;

        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobToDelete._id}`, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                const updatedJobs = filterJobs.filter(job => job._id !== jobToDelete._id);
                dispatch(setAllAdminJobs(updatedJobs));
                setFilterJobs(updatedJobs);
            }
        } catch (error) {
            console.error("Lỗi khi xóa công việc:", error);
            toast.error("Đã xảy ra lỗi khi xóa.");
        } finally {
            setOpenDeleteDialog(false);
            setJobToDelete(null);
        }
    };

    useEffect(() => {
        if (Array.isArray(allAdminJobs)) {
            setFilterJobs(allAdminJobs.filter((job) => {
                if (!searchJobByText) return true;
                return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
            }));
        }
    }, [allAdminJobs, searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>Danh sách các công việc đã đăng gần đây của bạn</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên công ty</TableHead>
                        <TableHead>Công việc</TableHead>
                        <TableHead>Ngày đăng</TableHead>
                        <TableHead>Hết hạn</TableHead>
                        <TableHead className='text-center'>Trạng thái</TableHead>
                        <TableHead className='text-center'>Số ứng viên</TableHead>
                        <TableHead className='text-right'>Hoạt động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id}>
                            <TableCell>{job?.company?.name}</TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{FormatApplyDate(job.createdAt)}</TableCell>
                            <TableCell>{FormatApplyDate(job.duration)}</TableCell>
                            <TableCell>
                                <div className="flex justify-center items-center w-full h-full">
                                    <Circle size={18} className={`${DaysAgo(job.duration) <= 0 ? 'fill-red-600 stroke-red-500' : 'fill-green-600 stroke-green-500'}`} />
                                </div>
                            </TableCell>
                            <TableCell className='text-center'>{job?.applications?.length}</TableCell>
                            <TableCell className='text-right cursor-pointer'>
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className='w-40 p-2'>
                                        <div onClick={() => fetchJob(job._id)} className='flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-xl cursor-pointer'>
                                            <AlertCircle className="w-4 h-4" />Chi tiết
                                        </div>
                                        <div onClick={() => navigate(`/recruiter/jobs/${job._id}`)} className='flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-xl cursor-pointer'>
                                            <Edit2 className='w-4 h-4' /><span>Chỉnh sửa</span>
                                        </div>
                                        <div onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)} className='flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-xl cursor-pointer'>
                                            <Eye className='w-4 h-4' /><span>Ứng viên</span>
                                        </div>
                                        <div
                                            onClick={() => {
                                                setJobToDelete(job);
                                                setOpenDeleteDialog(true);
                                            }}
                                            className='flex text-red-500 items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-xl cursor-pointer'
                                        >
                                            <Trash2 className='w-4 h-4' /><span>Xóa</span>
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSelectedJobId(job._id);
                                                setShowRecommend(true);
                                            }}
                                            className='flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded-xl cursor-pointer text-blue-600'
                                        >
                                            <Sparkles className='w-4 h-4' /><span>Gợi ý ứng viên</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog chi tiết công việc */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
                    <ReadJobDetails job={job} />
                </DialogContent>
            </Dialog>

            {/* Dialog gợi ý ứng viên */}
            <Dialog open={showRecommend} onOpenChange={setShowRecommend}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
                    <DialogTitle className="text-xl font-bold mb-4">
                        Gợi ý ứng viên phù hợp cho công việc
                    </DialogTitle>
                    <DialogDescription>
                        Danh sách ứng viên được hệ thống gợi ý dựa trên trình độ và kỹ năng yêu cầu của công việc.
                    </DialogDescription>
                    <RecommendCandidates jobId={selectedJobId} />
                </DialogContent>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent className="bg-white text-black p-6 max-w-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Xác nhận xoá công việc</h2>
                    <p className="mb-6">
                        Bạn có chắc chắn muốn xoá công việc <strong>{jobToDelete?.title}</strong> tại <strong>{jobToDelete?.company?.name}</strong>?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setOpenDeleteDialog(false)}
                            className="px-4 py-2 border rounded"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={confirmDeleteJob}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Xoá
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployerJobsTable;