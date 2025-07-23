import React, { useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { CV_API_END_POINT } from '@/utills/constant';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import ReadOnlyCV from './ReadOnlyCV';
import { toast } from 'sonner';

const CandidateCard = ({ user }) => {
  const [selectedCV, setSelectedCV] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchCV = async (cvId) => {
    try {
      const res = await axios.get(`${CV_API_END_POINT}/get/${cvId}`, {
        withCredentials: true,
      });
      setSelectedCV(res.data.cv);
      setOpenDialog(true);
    } catch (err) {
      toast.error('Không thể tải CV');
    }
  };

  return (
    <>
      <div className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-lg transition">
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={user.profile?.profilePhoto || '/default-avatar.png'}
            />
          </Avatar>
          <div>
            <h3 className="font-bold text-lg">{user.fullname}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">SĐT: {user.phoneNumber}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1 font-medium">Trình độ:</p>
          <p className="text-blue-600 font-semibold">
            {user.level_detail?.name || 'Không rõ'}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1 font-medium">Kỹ năng phù hợp:</p>
          <div className="flex flex-wrap gap-2">
            {user.matchedSkills?.map((s, i) => (
              <Badge key={i} variant="outline" className="text-sm">
                {s.skill?.name || 'Không rõ'} ({s.proficiency || 'Không rõ'})
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          {user?.cvId ? (
            <div
              onClick={() => fetchCV(user?.cvId)}
              className="flex items-center text-sm hover:text-blue-400 rounded-xl cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem hồ sơ (CV)
            </div>
          ) : (
            'Không có hồ sơ (CV)'
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white text-black p-6">
          <DialogTitle className="text-xl font-bold mb-4">Chi tiết CV</DialogTitle>
          <ReadOnlyCV cv={selectedCV} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateCard;