import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { toast } from 'sonner';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/input.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog.jsx';
import { Button } from '../ui/button.jsx';
import { LEVEL_API_END_POINT, TECHSKILL_API_END_POINT, USER_API_END_POINT } from '@/utills/constant.js';
import { setUser } from '@/redux/authSlice.js';

const proficiencyOptions = [
  { value: 'Cơ bản', label: 'Cơ bản' },
  { value: 'Trung bình', label: 'Trung bình' },
  { value: 'Khá', label: 'Khá' },
  { value: 'Tốt', label: 'Tốt' },
];

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector(store => store.auth);
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    level: null,
    github: '',
    skills: [],
  });

  const [loading, setLoading] = useState(false);
  const [techSkills, setTechSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const skillsWithLevel = Array.isArray(user?.profile?.skills)
      ? user.profile.skills.map(skill => {
          if (typeof skill === 'object') {
            const skillId = typeof skill.skill === 'object' ? skill.skill._id : skill.skill;
            return {
              skill: skillId || skill._id || '',
              proficiency: skill.proficiency || 'Cơ bản'
            };
          }
          return { skill, proficiency: 'Cơ bản' };
        })
      : [];

      setInput({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        level: typeof user?.profile?.level === 'object' ? user.profile.level._id : user?.profile?.level || '',
        github: user?.profile?.github || '',
        skills: skillsWithLevel,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formattedSkills = input.skills.map(s => ({
        skill: s.skill,
        proficiency: s.proficiency
      }));


      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        {
          fullname: input.fullname,
          email: input.email,
          phoneNumber: input.phoneNumber,
          bio: input.bio,
          level: input.level,
          github: input.github,
          skills: formattedSkills,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${TECHSKILL_API_END_POINT}/skills?limit=100`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setTechSkills(res.data.skills);
        }
      } catch (err) {
        console.error('Lỗi khi tải kỹ năng:', err);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axios.get(`${LEVEL_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setLevels(res.data.levels);
        }
      } catch (err) {
        console.error('Lỗi khi tải level:', err);
      }
    };
    fetchLevels();
  }, []);

  const techSkillOptions = techSkills.map(skill => ({
    value: skill._id,
    label: skill.name,
  }));

  return (
    <Dialog open={open}>
      <DialogContent
        className='bg-white sm:max-w-[600px] p-6 rounded shadow-lg max-h-screen overflow-y-auto'
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Cập nhật thông tin cá nhân</DialogTitle>
          <DialogDescription className='text-sm text-gray-500 mt-1'>
            Vui lòng cập nhật các thông tin bên dưới để hoàn thiện hồ sơ cá nhân của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='fullname' className='text-right'>Họ và tên</Label>
              <Input id='fullname' name='fullname' type='text' value={input.fullname} onChange={changeEventHandler} className='col-span-3 rounded' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>Email</Label>
              <Input id='email' name='email' type='email' value={input.email} onChange={changeEventHandler} className='col-span-3 rounded' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phoneNumber' className='text-right'>Số điện thoại</Label>
              <Input id='phoneNumber' name='phoneNumber' value={input.phoneNumber} onChange={changeEventHandler} className='col-span-3 rounded' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='bio' className='text-right'>Giới thiệu</Label>
              <Input id='bio' name='bio' value={input.bio} onChange={changeEventHandler} className='col-span-3 rounded' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='level' className='text-right'>Trình độ</Label>
              <ReactSelect
                id='level'
                name='level'
                options={levels.map(lv => ({ value: lv._id, label: lv.name }))}
                value={levels.map(lv => ({ value: lv._id, label: lv.name })).find(opt => opt.value === input.level)}
                onChange={(selectedOption) => setInput(prev => ({ ...prev, level: selectedOption.value }))}
                className='col-span-3 rounded'
              />
            </div>
            <div className='grid gap-2'>
              {input.skills.length === 0 ? (
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label className='text-right'>Kỹ năng</Label>
                  <div className='col-span-3'>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full hover:bg-blue-200 hover:text-blue-700 rounded'
                      size='sm'
                      onClick={() =>
                        setInput(prev => ({
                          ...prev,
                          skills: [...prev.skills, { skill: '', proficiency: 'Cơ bản' }],
                        }))
                      }
                    >
                      + Thêm kỹ năng
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label className='text-right'>Kỹ năng</Label>
                    <div className='col-span-3'></div>
                  </div>
                  {input.skills.map((item, index) => (
                    <div key={index} className='grid grid-cols-4 items-center gap-4'>
                      <div className='col-span-1 text-right text-sm font-medium'>
                        <span>Kỹ năng {index + 1}</span>
                      </div>
                      <div className='col-span-3 flex flex-col sm:flex-row items-center gap-3'>
                        <div className='w-full sm:w-52'>
                          <ReactSelect
                            options={techSkillOptions}
                            placeholder='Chọn kỹ năng'
                            value={techSkillOptions.find(opt => opt.value === item.skill)}
                            onChange={(selected) => {
                              const newSkills = [...input.skills];
                              newSkills[index].skill = selected.value;
                              setInput(prev => ({ ...prev, skills: newSkills }));
                            }}
                          />
                        </div>
                        <div className='w-full sm:w-36'>
                          <ReactSelect
                            options={proficiencyOptions}
                            placeholder='Mức độ'
                            value={proficiencyOptions.find(p => p.value === item.proficiency)}
                            onChange={(selected) => {
                              const newSkills = [...input.skills];
                              newSkills[index].proficiency = selected.value;
                              setInput(prev => ({ ...prev, skills: newSkills }));
                            }}
                          />
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          className='text-red-600 hover:bg-red-100 hover:text-red-600 p-2 rounded-xl'
                          onClick={() => {
                            const newSkills = input.skills.filter((_, i) => i !== index);
                            setInput(prev => ({ ...prev, skills: newSkills }));
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className='flex justify-end'>
                    <Button
                      type='button'
                      variant='outline'
                      className='hover:bg-blue-200 hover:text-blue-700 rounded'
                      size='sm'
                      onClick={() =>
                        setInput(prev => ({
                          ...prev,
                          skills: [...prev.skills, { skill: '', proficiency: 'Cơ bản' }],
                        }))
                      }
                    >
                      + Thêm kỹ năng
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='github' className='text-right'>Github</Label>
              <Input id='github' name='github' value={input.github} onChange={changeEventHandler} className='col-span-3 rounded' />
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className='w-full my-4 rounded-xl flex items-center justify-center'>
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                Xin hãy đợi giây lát
              </Button>
            ) : (
              <Button type='submit' className='w-full mt-6 text-white bg-blue-700 hover:bg-blue-500 rounded px-6 py-2 font-medium'>
                Cập nhật
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
