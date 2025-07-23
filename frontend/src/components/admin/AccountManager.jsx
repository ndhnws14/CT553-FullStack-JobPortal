import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import Sidebar from "../shared/Sidebar.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.jsx";
import { Button } from "../ui/button.jsx";

import { USER_API_END_POINT } from "@/utills/constant";
import { setAllUsers } from "@/redux/authSlice";
import useGetAdminAllUsers from "@/hooks/useGetAdminAllUsers";
import FormatApplyDate from "../FormatApplyDate.jsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.jsx";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog.jsx";
import { toast } from "sonner";

const AccountManager = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const { allUsers } = useSelector((store) => store.auth);
  useGetAdminAllUsers();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = allUsers?.filter(user =>
    user.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalPages = Math.ceil((filteredUsers.length || 0) / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  const openConfirmDelete = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!userToDelete) return;

    try {
      const res = await axios.delete(`${USER_API_END_POINT}/delete/${userToDelete._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedUsers = allUsers.filter(user => user._id !== userToDelete._id);
        dispatch(setAllUsers(updatedUsers));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa không thành công!");
    } finally {
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10">
        <h2 className="text-2xl font-semibold mb-2">Quản lý tài khoản</h2>
        <p className="text-gray-600">Danh sách và quản lý thông tin người dùng hệ thống.</p>

        <div className="flex flex-wrap items-center gap-4 my-4">
          <input
            type="text"
            placeholder="Lọc theo tên hoặc vai trò..."
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
            Danh sách người dùng đăng ký ({filteredUsers?.length})
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Tài khoản</TableHead>
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{FormatApplyDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => openConfirmDelete(user)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 ml-4 rounded"
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
                    Không có người dùng nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-end mt-4 gap-2">
              <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                Trước
              </Button>
              <span className="px-4 py-2 text-sm font-medium">
                Trang {page}/{totalPages}
              </span>
              <Button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                Sau
              </Button>
            </div>
          )}
        </div>

        {/* Dialog xác nhận xóa */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="max-w-md p-6 rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn muốn xóa người dùng này?
            </h3>
            <p className="mb-6">
              Tên người dùng: <strong>{userToDelete?.fullname}</strong>
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
      </div>
    </div>
  );
};

export default AccountManager;
