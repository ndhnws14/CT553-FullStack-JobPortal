import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { Dialog, DialogContent } from '../ui/dialog.jsx';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { Eye } from 'lucide-react';
import { CV_API_END_POINT } from '@/utills/constant.js';
import ReadOnlyCV from './ReadOnlyCV.jsx';
import FormatApplyDate from '../FormatApplyDate.jsx';


const EmployerApplicantsInProfile = () => {
    const { allApplicants } = useSelector(store => store.application);

    const [selectedCV, setSelectedCV] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchCV = async (cvId) => {
        try {
            const res = await axios.get(`${CV_API_END_POINT}/get/${cvId}`, { withCredentials: true });
            setSelectedCV(res.data.cv);
            setOpenDialog(true);
        } catch (err) {
            toast.error("Không thể tải CV");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>Danh sách những người đã ứng tuyển</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Họ và tên</TableHead>
                        <TableHead>Hồ sơ</TableHead>
                        <TableHead>Công việc</TableHead>
                        <TableHead>Ngày ứng tuyển</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allApplicants?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>
                                {item?.applicant?.cvId ? (
                                    <div onClick={() => fetchCV(item.applicant.cvId)} className='flex items-center text-sm hover:text-blue-400 rounded-xl cursor-pointer'>
                                        <Eye className="w-4 h-4 mr-2" />Xem CV
                                    </div>
                                ) : "Không có"}
                            </TableCell>
                            <TableCell>{item?.job?.title}</TableCell>
                            <TableCell>{FormatApplyDate(item?.createdAt)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
                    <ReadOnlyCV cv={selectedCV} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployerApplicantsInProfile;
