import axios from "axios";
import React, { 
    useEffect, 
    useRef, 
    useState 
} from "react";
import { TECHSKILL_API_END_POINT } from "@/utills/constant";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import Sidebar from "../shared/Sidebar.jsx";
import FormatApplyDate from "../FormatApplyDate";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addSkillRequest, setRequestSkills, updateRequestStatus } from "@/redux/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftCircle, ArrowRightCircle, Pencil, Trash, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import socket from "@/lib/socket";

const statusOptions = [
    { label: "Duyệt", value: "Duyệt", color: "text-green-600 bg-green-100 hover:bg-green-200" },
    { label: "Từ chối", value: "Từ chối", color: "text-red-600 bg-red-100 hover:bg-red-200" }
];

const SkillManager = () => {
  const dispatch = useDispatch();
  const nameInputRef = useRef(null);
  const {requestSkills} = useSelector(store => store.requestSkill);
  const [input, setInput] = useState({
    name: "",
    category: "",
  });

  const [openDeleteSkillDialog, setOpenDeleteSkillDialog] = useState(false);
  const [openDeleteRequestDialog, setOpenDeleteRequestDialog] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);


  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [totalSkills, setTotalSkills] = useState(0);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const totalPages = Math.ceil(totalSkills / limit);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${TECHSKILL_API_END_POINT}/skills`, {
        params: {
          category: filterCategory,
          search,
          page,
          limit,
        },
        withCredentials: true,
      });
      if (res.data.success) {
        setSkills(res.data.skills);
        setTotalSkills(res.data.totalSkills);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kỹ năng:", error);
    }
  };

  const fetchRequestSkills = async () => {
    try {
      const res = await axios.get(`${TECHSKILL_API_END_POINT}/request`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setRequestSkills(res.data.requestSkills));
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kỹ năng:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchRequestSkills();
  }, [filterCategory, search, page]);

  const addSkillHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${TECHSKILL_API_END_POINT}/create-skill`,
        {
          name: input.name,
          category: input.category,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setInput({ name: "", category: "" });
        fetchSkills();
        toast.success(res.data?.message);
        document.querySelector('input[name="name"]')?.focus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo kỹ năng.");
    }
  };

  const editHandler = async (id) => {
    const skill = skills.find((skill) => skill._id === id);
    setInput({
      name: skill.name,
      category: skill.category,
    });
    setEditingSkillId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 300);
  };

  const updateSkillHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${TECHSKILL_API_END_POINT}/update-skill/${editingSkillId}`,
        {
          name: input.name,
          category: input.category,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setInput({ name: "", category: "" });
        setEditingSkillId(null);
        fetchSkills();
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật kỹ năng");
    }
  };

  const deleteHandler = (skill) => {
    setSkillToDelete(skill);
    setOpenDeleteSkillDialog(true);
  };

  const confirmDeleteSkill = async () => {
    try {
      const res = await axios.delete(
        `${TECHSKILL_API_END_POINT}/remove-skill/${skillToDelete._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setSkills(res.data.skills);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa kỹ năng");
    } finally {
      setOpenDeleteSkillDialog(false);
      setSkillToDelete(null);
    }
  };


  const statusHandler = async (status, id) => {
    try {
      const res = await axios.put(`${TECHSKILL_API_END_POINT}/update-status/${id}`, { status }, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        dispatch(updateRequestStatus({ id, status }));
      } else {
        toast.error(res?.data?.message || "Cập nhật thất bại.");
      }

    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error(error?.response?.data?.message || "Lỗi máy chủ hoặc mạng.");
    }
  };

  const deleteRequestHandler = (request) => {
    setRequestToDelete(request);
    setOpenDeleteRequestDialog(true);
  };

  const confirmDeleteRequest = async () => {
    try {
      const res = await axios.delete(
        `${TECHSKILL_API_END_POINT}/delete-request/${requestToDelete._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setRequestSkills(
          requestSkills.filter(item => item._id !== requestToDelete._id)
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa yêu cầu");
    } finally {
      setOpenDeleteRequestDialog(false);
      setRequestToDelete(null);
    }
  };

  useEffect(() => {
    socket.on('skill_request', (skillRequest) => dispatch(addSkillRequest(skillRequest)));

    return () => {
      socket.off('skill_request');
    };
  }, [dispatch])



  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-10">
        <h2 className="text-2xl font-semibold mb-2">Quản lý Công nghệ - Kỹ năng</h2>
        <p className="text-gray-600 mb-6">Trang này dùng để quản lý danh sách các kỹ năng, công nghệ,...</p>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-6 lg:gap-8 my-4">
          <form
            onSubmit={editingSkillId ? updateSkillHandler : addSkillHandler}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-md space-y-4 w-full"
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {editingSkillId ? "Cập nhật Kỹ Năng" : "Thêm Kỹ Năng Mới"}
            </h3>
            <Input
              ref={nameInputRef}
              name="name"
              type="text"
              placeholder="Tên kỹ năng"
              value={input.name}
              onChange={changeEventHandler}
              className={`w-full p-2 border rounded transition duration-300
                          ${editingSkillId ? "border-blue-400 ring-2 ring-blue-300" : "border-gray-300"}`}
              required
            />
            <Input
              name="category"
              type="text"
              placeholder="Danh mục"
              value={input.category}
              onChange={changeEventHandler}
              className={`w-full p-2 border rounded transition duration-300
                          ${editingSkillId ? "border-blue-400 ring-2 ring-blue-300" : "border-gray-300"}`}
              required
            />
            <Button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {editingSkillId ? "Cập nhật Kỹ Năng" : "Thêm Kỹ Năng"}
            </Button>
          </form>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Thông báo yêu cầu của người dùng
            </h3>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {!requestSkills || requestSkills.length === 0 ? (
                <span className="text-center text-sm text-gray-600">Chưa có yêu cầu nào...</span>
              ) : (
                requestSkills?.map((req) => (
                  <div
                    key={req._id}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition duration-200"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-y-2">
                      <div className="text-sm text-gray-800">
                        <span className="font-semibold">{req.requestedBy.fullname}</span> đã yêu cầu thêm công nghệ - kỹ năng:
                        <span className="text-blue-600 ml-1 font-medium">{req.name}</span>
                      </div>
                      <Popover>
                        <PopoverTrigger>
                          <span
                            className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold
                              ${req.status === "Duyệt" ? "bg-green-100 text-green-700" :
                                req.status === "Từ chối" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"}`}
                          >
                            {req.status === "Duyệt" ? "Đã duyệt" : req.status === "Từ chối" ? "Đã từ chối" : "Chờ duyệt"}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent className='w-32 p-2 mt-2'>
                            {statusOptions.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => statusHandler(option.value, req._id)}
                                    className={`flex items-center gap-2 px-2 py-2 my-2 w-full rounded-xl transition text-sm font-medium cursor-pointer ${option.color}`}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <Button 
                        type="button"
                        className="text-red-500 hover:text-red-700 hover:bg-red-300 rounded-2xl transition"
                        onClick={() => deleteRequestHandler(req)}
                      >
                        <Trash size={16} />
                      </Button>
                      <div className="text-xs text-gray-500 mt-2 text-right">
                        {FormatApplyDate(req.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full sm:w-64"
          />
          <input
            type="text"
            placeholder="Lọc theo danh mục"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded w-full sm:w-64"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">
            Danh sách kỹ năng ({totalSkills})
          </h4>
          {skills.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Tên kỹ năng</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill, index) => (
                    <TableRow key={skill._id}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>{skill.category}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => editHandler(skill._id)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded"
                              >
                                <Pencil size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Chỉnh sửa</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => deleteHandler(skill)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xóa</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
            </>
          ) : (
            <p className="text-gray-500 italic">Không có kỹ năng nào phù hợp.</p>
          )}
        </div>
      </div>

      <Dialog open={openDeleteSkillDialog} onOpenChange={setOpenDeleteSkillDialog}>
        <DialogContent className="max-w-md bg-white text-black p-6 text-center">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa kỹ năng</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc muốn xóa kỹ năng <strong>{skillToDelete?.name}</strong>?</p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" className='rounded' onClick={() => setOpenDeleteSkillDialog(false)}>Huỷ</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded" onClick={confirmDeleteSkill}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteRequestDialog} onOpenChange={setOpenDeleteRequestDialog}>
        <DialogContent className="max-w-md bg-white text-black p-6 text-center">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa yêu cầu</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc muốn xóa yêu cầu về kỹ năng <strong>{requestToDelete?.name}</strong> từ <strong>{requestToDelete?.requestedBy?.fullname}</strong>?</p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" className='rounded' onClick={() => setOpenDeleteRequestDialog(false)}>Huỷ</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded" onClick={confirmDeleteRequest}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillManager;
