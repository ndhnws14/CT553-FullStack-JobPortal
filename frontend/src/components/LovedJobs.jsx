import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utills/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { setUser } from "@/redux/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import FormatApplyDate from "./FormatApplyDate";

const LovedJobs = () => {
    const [lovedJobs, setLovedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
    const [jobToDelete, setJobToDelete] = useState(null);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const confirmRemoveJob = (job) => {
        setJobToDelete(job);
        setShowConfirmDialog(true);
    };

    const removeJobHandler = async () => {
        if (!jobToDelete) return;

        const jobId = jobToDelete._id;
        setDeletingId(jobId);
        setShowConfirmDialog(false);

        try {
            const res = await axios.delete(`${USER_API_END_POINT}/unlove/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                const updatedUser = {
                    ...user,
                    lovedJobs: user.lovedJobs ? user.lovedJobs.filter((id) => id !== jobId) : []
                };
                dispatch(setUser(updatedUser));
                setLovedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
            } else {
                 toast.error(res.data.message || "Đã xảy ra lỗi khi xóa.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa công việc:", error);
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi xóa.";
            toast.error(errorMessage);
        } finally {
            setDeletingId(null);
            setJobToDelete(null);
        }
    }

    useEffect(() => {
        const fetchLovedJobs = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${USER_API_END_POINT}/loved-jobs`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    setLovedJobs(res.data.lovedJobs);
                } else {
                    toast.error(res.data.message || "Lỗi khi lấy danh sách công việc đã yêu thích.");
                    setLovedJobs([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách công việc đã yêu thích:", error);
                const errorMessage = error.response?.data?.message || "Lỗi khi lấy danh sách công việc đã yêu thích.";
                toast.error(errorMessage);
                setLovedJobs([]);
            } finally {
                 setLoading(false);
            }
        };
        if (user) {
             fetchLovedJobs();
        } else {
             setLoading(false);
             setLovedJobs([]);
        }

    }, [user]);
    
    const daysAgo = (date) => {
        const diff = new Date(date) - new Date();
        return Math.floor((diff / (1000 * 60 * 60 * 24)) + 1);
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
                 <Link to="/jobs" className="mr-4 p-2 rounded-full transition-colors duration-200">
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-100" />
                 </Link>
                 <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Công việc được yêu thích
                 </h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableCaption className="px-6 py-3 text-center text-sm text-gray-600">
                        Danh sách các công việc bạn đã yêu thích
                    </TableCaption>

                    <TableHeader className="bg-blue-100">
                        <TableRow>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Công việc</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Hạn nộp hồ sơ</TableHead>
                            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">Xóa</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                     <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> Đang tải danh sách công việc...
                                </TableCell>
                            </TableRow>
                        ) : (
                            lovedJobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                        Bạn chưa yêu thích công việc nào. Hãy tìm kiếm và thêm vào danh sách!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lovedJobs.map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link to={`/description/${job._id}`} className="text-blue-600 hover:underline">
                                                {job.title || "Không rõ tên công việc"}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {daysAgo(job.duration) <= 0 ? 'Đã hết hạn tuyển' : `${FormatApplyDate(job.duration)}`}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                onClick={() => confirmRemoveJob(job)}
                                                variant='ghost'
                                                className='w-8 h-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-full transition-colors duration-200'
                                                title="Xóa công việc"
                                                disabled={deletingId === job._id}
                                            >
                                                 {deletingId === job._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                     <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900 opacity-100">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Xác nhận xóa</DialogTitle>
                        <DialogDescription className="text-gray-700">
                            Bạn có chắc chắn muốn xóa công việc "{jobToDelete?.title}" khỏi danh sách yêu thích không?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline"
                            className="rounded hover:bg-gray-300" 
                            onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
                        <Button variant="destructive" className="rounded text-red-600 hover:bg-red-300" onClick={removeJobHandler}>
                            {deletingId ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default LovedJobs;