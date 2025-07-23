import React, { useEffect, useState } from 'react';
import { AlertCircle, Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '../ui/table.jsx';
import { Avatar, AvatarImage } from '../ui/avatar.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utills/constant.js';
import { toast } from 'sonner';
import { setAllCompanies } from '@/redux/companySlice.js';
import FormatApplyDate from '../FormatApplyDate.jsx';
import { Dialog, DialogContent } from '../ui/dialog.jsx';
import ReadCompanyDetails from './ReadCompanyDetails.jsx';

const EmployerCompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(store => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);

  const [openDialog, setOpenDialog] = useState(false);
  const [company, setCompany] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCompany = async (companyId) => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get-company/${companyId}`, {
        withCredentials: true
      });
      setCompany(res.data.company);
      setOpenDialog(true);
    } catch (err) {
      toast.error("Không thể tải thông tin công ty");
    }
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete-company/${companyToDelete._id}`, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedCompanies = filterCompany.filter(c => c._id !== companyToDelete._id);
        dispatch(setAllCompanies(updatedCompanies));
        setFilterCompany(updatedCompanies);
      }
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
      toast.error("Đã xảy ra lỗi khi xóa.");
    } finally {
      setOpenDeleteDialog(false);
      setCompanyToDelete(null);
    }
  };

  useEffect(() => {
    const filtered = companies.length >= 0 && companies.filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  return (
    <div>
      <Table>
        <TableCaption>Danh sách các công ty đã đăng ký gần đây của bạn</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Tên công ty</TableHead>
            <TableHead>Ngày đăng ký</TableHead>
            <TableHead className='text-right'>Hoạt động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            filterCompany?.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={company.logo} />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{FormatApplyDate(company.createdAt)}</TableCell>
                <TableCell className='text-right cursor-pointer'>
                  <Popover>
                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                    <PopoverContent className='w-32 p-2'>
                      <div
                        onClick={() => fetchCompany(company._id)}
                        className='flex items-center gap-2 px-2 py-2 w-full hover:bg-gray-100 rounded-xl cursor-pointer'
                      >
                        <AlertCircle className="w-4 h-4" />Chi tiết
                      </div>
                      <div
                        onClick={() => navigate(`/recruiter/companies/${company._id}`)}
                        className='flex items-center gap-2 px-2 py-2 w-full hover:bg-gray-100 rounded-xl cursor-pointer'
                      >
                        <Edit2 className='w-4 h-4' />
                        <span>Chỉnh sửa</span>
                      </div>
                      <div
                        onClick={() => {
                          setCompanyToDelete(company);
                          setOpenDeleteDialog(true);
                        }}
                        className='flex text-red-500 items-center gap-2 px-2 py-2 w-full hover:bg-gray-100 rounded-xl cursor-pointer'
                      >
                        <Trash2 className='w-4 h-4 ml-2' />
                        <span>Xóa</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      {/* Dialog xem chi tiết công ty */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
          <ReadCompanyDetails company={company} />
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xoá */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="bg-white text-black p-6 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Xác nhận xoá công ty</h2>
          <p className="mb-6">
            Bạn có chắc chắn muốn xoá công ty <strong>{companyToDelete?.name}</strong> không?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setOpenDeleteDialog(false)}
              className="px-4 py-2 border rounded"
            >
              Huỷ
            </button>
            <button
              onClick={confirmDeleteCompany}
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

export default EmployerCompaniesTable;
