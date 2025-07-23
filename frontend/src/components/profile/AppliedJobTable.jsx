import React, { useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FormatApplyDate from '../FormatApplyDate.jsx';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import socket from '@/lib/socket.js';
import { updateApplicationStatus, updateInterviewDate } from '@/redux/applicationSlice.js';
import { removeAppliedJob } from '@/redux/jobSlice.js';

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(() => {
        const handleStatusUpdate = ({ applicationId, status }) => {
            console.log("Received status update:", { applicationId, status });
            dispatch(updateApplicationStatus({ id: applicationId, status }));
        };
        const handleInterviewUpdate = ({ applicationId, interviewDate }) => {
            console.log("Received interviewDate update:", { applicationId, interviewDate });
            dispatch(updateInterviewDate({ id: applicationId, interviewDate }));
        };
        const handleApplicantDelete = (applicantId) => {
            dispatch(removeAppliedJob(applicantId));
        };

        socket.on("application_status_updated", handleStatusUpdate);
        socket.on("interview_date_updated", handleInterviewUpdate);
        socket.on("applicant_deleted", handleApplicantDelete);

        return () => {
            socket.off("application_status_updated", handleStatusUpdate);
            socket.off("interview_date_updated", handleInterviewUpdate);
            socket.off("applicant_deleted", handleApplicantDelete);
        };
    }, [dispatch]);
  return (
    <div className='dark:text-gray-700'>
        <Table>
            <TableCaption>Danh sách các công việc bạn đã ứng tuyển</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Thời gian</TableHead>
                    <TableHead>Công việc</TableHead>
                    <TableHead>Công ty</TableHead>
                    <TableHead>Lịch phỏng vấn</TableHead>
                    <TableHead className="text-right w-[160px]">Trạng thái</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    allAppliedJobs?.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500">
                                Bạn chưa ứng tuyển công việc nào.
                            </TableCell>
                        </TableRow>
                    ) : 
                    allAppliedJobs?.map((appliedJob) => (
                        <TableRow key={appliedJob._id}>
                            <TableCell>{FormatApplyDate(appliedJob.createdAt)}</TableCell>
                            <TableCell className="font-medium">
                                {appliedJob.job?.title ? (
                                    <Link to={`/description/${appliedJob.job?._id}`} className="text-blue-600 hover:underline">
                                         {appliedJob.job.title}
                                    </Link>
                                ) : "N/A"}
                            </TableCell>
                            <TableCell>{appliedJob.job?.company?.name}</TableCell>
                            <TableCell>
                                {appliedJob?.interviewDate ? (
                                    <span className="text-sm text-gray-700">
                                        {new Date(appliedJob.interviewDate).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500 italic">Chưa có lịch phỏng vấn</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                                    appliedJob.status === "Đã bị hủy"
                                    ? "bg-red-100 text-red-700"
                                    : appliedJob.status === "Đang gửi"
                                    ? "bg-gray-200 text-gray-800"
                                    : "bg-green-100 text-green-700"
                                }`}>
                                    {appliedJob.status === "Đã bị hủy" && <XCircle size={16} className="mr-1" />}
                                    {appliedJob.status === "Đang gửi" && <Clock size={16} className="mr-1" />}
                                    {appliedJob.status === "Đã xác nhận" && <CheckCircle size={16} className="mr-1" />}
                                    {appliedJob.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default AppliedJobTable;