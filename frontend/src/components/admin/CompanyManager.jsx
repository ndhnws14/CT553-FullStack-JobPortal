import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import Sidebar from "../shared/Sidebar.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.jsx";
import { Button } from "../ui/button.jsx";

import { COMPANY_API_END_POINT } from "@/utills/constant";
import { setAllCompanies } from "@/redux/companySlice";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import FormatApplyDate from "../FormatApplyDate.jsx";
import { toast } from "sonner";
import { Dialog, DialogContent } from "../ui/dialog.jsx";
import ReadCompanyDetails from "../employer/ReadCompanyDetails.jsx";
import { AlertCircle, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.jsx";

const CompanyManager = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);
  useGetAllCompanies();

  const [openDialog, setOpenDialog] = useState(false);
  const [company, setCompany] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const fetchCompany = async (companyId) => {
    try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get-company/${companyId}`, { withCredentials: true });
        
        setCompany(res.data.company);
        setOpenDialog(true);
    } catch (err) {
        toast.error("Không thể tải thông tin công ty");
    }
  };

  const filteredCompanies = (companies || []).filter(company =>
    company.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / limit);
  const paginatedCompanies = filteredCompanies.slice((page - 1) * limit, page * limit);

  const openDeleteConfirm = (company) => {
    setCompanyToDelete(company);
    setOpenDeleteDialog(true);
  };
  const handleDeleteConfirmed = async () => {
    if (!companyToDelete) return;

    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete-company/${companyToDelete._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedCompanies = companies.filter(c => c._id !== companyToDelete._id);
        dispatch(setAllCompanies(updatedCompanies));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa công ty không thành công!");
    } finally {
      setOpenDeleteDialog(false);
      setCompanyToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10">
        <h2 className="text-2xl font-semibold mb-2">Quản lý công ty</h2>
        <p className="text-gray-600">Quản lý thông tin các công ty, trạng thái và xác thực.</p>

        <div className="flex flex-wrap items-center gap-4 my-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên công ty"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded w-64"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">
            Danh sách công ty ({filteredCompanies.length})
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Tên công ty</TableHead>
                <TableHead>Số lượng công việc</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompanies.length > 0 ? (
                paginatedCompanies.map((company, index) => (
                  <TableRow key={company._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      <img src={company.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                    </TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.jobCount} công việc</TableCell>
                    <TableCell>{FormatApplyDate(company.createdAt)}</TableCell>
                    <TableCell>
                      <div onClick={() => fetchCompany(company._id)} className='w-24 gap-2 px-2 py-2 ml-2 cursor-pointer'>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => openDeleteConfirm(company)}
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
                    Không có công ty nào phù hợp.
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
                Trước
              </Button>
              <span className="px-4 py-2 text-sm font-medium">
                Trang {page}/{totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
        {/* Dialog xác nhận xóa */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="max-w-md p-6 rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn xóa công ty này (bao gồm các công việc và ứng tuyển liên quan)?
            </h3>
            <p className="mb-6">
              Tên công ty: <strong>{companyToDelete?.name}</strong>
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
            <ReadCompanyDetails company={company} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompanyManager;
