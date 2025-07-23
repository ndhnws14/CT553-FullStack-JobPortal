import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { TECHSKILL_API_END_POINT } from '@/utills/constant';

const RequestSkillDialog = ({ open, setOpen }) => {
  const [skillName, setSkillName] = useState("");

  const handleSubmit = async () => {
    try {
      if (!skillName.trim()) {
        toast.error("Tên kỹ năng không được để trống.");
        return;
      }

      const res = await axios.post(`${TECHSKILL_API_END_POINT}/request-skill`, { name: skillName }, {
            withCredentials: true
        })
      if (res.data.success) {
        toast.success(res.data.message);
        setSkillName("");
        setOpen(false);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi từ server.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white text-gray-900 opacity-100">
        <DialogHeader>
          <DialogTitle className="text-blue-600 font-bold">Yêu cầu thêm kỹ năng mới</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nhập tên kỹ năng bạn muốn thêm..."
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="rounded"
        />
        <DialogFooter>
          <Button type="button" className="rounded bg-blue-600 hover:bg-blue-300" onClick={handleSubmit}>Gửi yêu cầu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestSkillDialog;
