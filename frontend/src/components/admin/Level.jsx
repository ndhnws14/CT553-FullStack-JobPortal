import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../shared/Sidebar";
import { LEVEL_API_END_POINT } from "@/utills/constant";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AlertCircle, Edit2, Loader2, Trash2 } from "lucide-react";
import FormatApplyDate from "../FormatApplyDate";
import ReadLevelDetail from "./ReadLevelDetail";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Level = () => {
  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    exprience: "",
    skill_description: "",
    target: ""
  });

  const fetchLevels = async () => {
    try {
      const res = await axios.get(`${LEVEL_API_END_POINT}/get`, {
        withCredentials: true
      });
      setLevels(res.data.levels);
    } catch (err) {
      console.error("Fetch levels failed:", err.message);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevelById = async (levelId) => {
    try {
        const res = await axios.get(`${LEVEL_API_END_POINT}/get/${levelId}`, { withCredentials: true });
        
        setLevel(res.data.level);
        setOpenDialog(true);
    } catch (err) {
        toast.error("Không thể tải thông tin công ty");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${LEVEL_API_END_POINT}/create-level`, form, {
        withCredentials: true
      });
      if (res.data.success) {
        setIsOpen(false);
        setForm({
          name: "",
          exprience: "",
          skill_description: "",
          target: ""
        });
        fetchLevels();
        toast.success(res.data?.message || "Tạo trình độ thành công!");
      }
    } catch (err) {
      toast.error("Tạo trình độ thất bại!");
      console.error("Create level failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
      try {
        const res = await axios.put(`${LEVEL_API_END_POINT}/update-level/${level._id}`, form, {
          withCredentials: true
        });
        if (res.data.success) {
          toast.success("Cập nhật thành công!");
          fetchLevels();
          setOpenDialog(false);
          setIsEditing(false);
        }
      } catch (error) {
        toast.error("Cập nhật thất bại!");
        console.error("Update failed:", error);
      }
  }

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${LEVEL_API_END_POINT}/delete-level/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchLevels();
      }
    } catch (err) {
      console.error("Delete level failed:", err.message);
      toast.error("Xóa thất bại!");
    }
  };


  const changeHandler = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Trình độ dành cho chuyên ngành IT
            </h2>
            <p className="text-gray-600">
              Trang này dùng để quản lý, phân loại các trình độ dành cho ứng viên và nhà tuyển dụng.
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto text-center"
            onClick={() => setIsOpen(true)}
          >
            + Tạo trình độ
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h4 className="text-lg font-semibold mb-4">
            Danh sách trình độ ({levels.length})
          </h4>
          {levels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Tên trình độ</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Chi tiết</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levels.map((level, index) => (
                  <TableRow key={level._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{level.name}</TableCell>
                    <TableCell>
                      {FormatApplyDate(level.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div onClick={() => fetchLevelById(level._id)} className='gap-2 px-2 py-2 ml-2 cursor-pointer'>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setConfirmDeleteId(level._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 ml-4 rounded"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Xóa</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center italic">
              Không có trình độ nào phù hợp.
            </p>
          )}
        </div>
      </div>

      {/* --- Form Dialog --- */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent className="bg-white rounded-xl p-6 max-w-md">
          <DialogHeader>
            <DialogTitle>Bạn có chắc muốn xóa?</DialogTitle>
            <DialogDescription>
              Thao tác này sẽ xóa trình độ khỏi hệ thống. Bạn không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteId(null)}
              className="rounded hover:bg-gray-200"
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700 rounded"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white sm:max-w-[500px] p-6 rounded shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tạo trình độ IT
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
                Vui lòng cập nhật các thông tin bên dưới để hoàn thiện tạo trình độ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên trình độ
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={changeHandler}
                  className="col-span-3 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="exprience" className="text-right">
                  Kinh nghiệm
                </Label>
                <Textarea
                  id="exprience"
                  name="exprience"
                  value={form.exprience}
                  onChange={changeHandler}
                  className="col-span-3 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skill_description" className="text-right">
                  Mô tả kỹ năng
                </Label>
                <Textarea
                  id="skill_description"
                  name="skill_description"
                  value={form.skill_description}
                  onChange={changeHandler}
                  className="col-span-3 rounded-xl"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Mục tiêu
                </Label>
                <Textarea
                  id="target"
                  name="target"
                  value={form.target}
                  onChange={changeHandler}
                  className="col-span-3 rounded-xl"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              {loading ? (
                <Button className="w-full my-4 rounded-xl flex items-center justify-center">
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Đang tạo...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full mt-6 text-white bg-blue-700 hover:bg-blue-500 rounded-xl px-6 py-2 font-medium"
                >
                  Tạo trình độ
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* --- Dialog Detail --- */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6 rounded-xl">
            <div className="flex justify-between items-center my-4">
              <h2 className="text-xl font-semibold">Chi tiết trình độ</h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setForm({
                      name: level.name,
                      exprience: level.exprience,
                      skill_description: level.skill_description,
                      target: level.target,
                    });
                    setIsEditing(true);
                  }}
                  className="flex gap-1 text-sm rounded hover:bg-gray-300"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </Button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={handleUpdate}
              >
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Tên trình độ</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="exprience">Kinh nghiệm</Label>
                    <Textarea
                      name="exprience"
                      value={form.exprience}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="skill_description">Mô tả kỹ năng</Label>
                    <Textarea
                      name="skill_description"
                      value={form.skill_description}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="target">Mục tiêu</Label>
                    <Textarea
                      name="target"
                      value={form.target}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    type="button"
                    className='rounded hover:bg-red-400'
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 rounded">
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            ) : (
              <ReadLevelDetail level={level} />
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default Level;
