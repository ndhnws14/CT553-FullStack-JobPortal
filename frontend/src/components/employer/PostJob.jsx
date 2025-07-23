import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, CalendarIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Button } from '../ui/button.jsx';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../ui/select.jsx';
import axios from 'axios';
import { JOB_API_END_POINT, LEVEL_API_END_POINT, TECHSKILL_API_END_POINT } from '@/utills/constant.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../ui/textarea.jsx';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import RequestSkillDialog from '../RequestSkillDialog.jsx';

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "",
    benefit: "",
    quantity: "",
    duration: "",
    requiredSkills: [],
    requiredLevels: [],
    companyId: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [techSkills, setTechSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { companies } = useSelector(store => store.company);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeSelectHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (input.requiredSkills.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kỹ năng công nghệ.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${TECHSKILL_API_END_POINT}/skills?limit=100`, {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setTechSkills(res.data.skills);
        }
      } catch (err) {
        console.error("Lỗi khi tải kỹ năng:", err);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchLevels = async () => {
        try {
            const res = await axios.get(`${LEVEL_API_END_POINT}/get`, {
                withCredentials: true
            });
            if (res.data.success) {
                setLevels(res.data.levels);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách level:", err);
        }
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    setInput(prev => ({
      ...prev,
      duration: ""
    }));
  }, []);

  return (
    <div>
      <div className='max-w-6xl mx-auto'>
        <div className='relative flex items-center justify-center mt-4'>
          <Button onClick={() => navigate("/recruiter/jobs")} className='absolute left-0 ml-4'>
            <ArrowLeft />
          </Button>
          <h1 className='font-bold text-2xl text-center'>Tạo công việc</h1>
        </div>
        <p className='border-b-2 border-b-gray-300 py-2'></p>
        <div className="flex justify-end my-2">
          <Button variant="outline" className="text-gray-500 rounded-xl hover:bg-gray-200 dark:text-gray-100" onClick={() => setOpenDialog(true)}>
              + Yêu cầu thêm kỹ năng
          </Button>
          <RequestSkillDialog open={openDialog} setOpen={setOpenDialog} />
        </div>
        <form onSubmit={submitHandler} className='bg-white border border-gray-500 rounded-xl p-6 max-w-4xl mx-auto dark:text-gray-700'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Công việc</Label>
              <Textarea
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
              <Label>Mô tả công việc</Label>
              <Textarea
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
              <Label>Yêu cầu công việc</Label>
              <Textarea
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
              <Label>Phúc lợi</Label>
              <Textarea
                name='benefit'
                value={input.benefit}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
                <Label>Kỹ năng công nghệ yêu cầu</Label>
                <ReactSelect
                    isMulti
                    name="requiredSkills"
                    placeholder='Chọn kỹ năng yêu cầu dành cho ứng viên...'
                    options={techSkills.map(skill => ({ value: skill._id, label: skill.name }))}
                    classNamePrefix="select"
                    onChange={(selectedOptions) => {
                        const selectedSkillIds = selectedOptions.map(option => option.value);
                        setInput(prev => ({
                        ...prev,
                        requiredSkills: selectedSkillIds
                        }));
                    }}
                    value={techSkills
                        .filter(skill => input.requiredSkills.includes(skill._id))
                        .map(skill => ({ value: skill._id, label: skill.name }))
                    }
                    className="my-1 border border-gray-800 rounded"
                />
            </div>
            <div>
              <Label>Yêu cầu trình độ</Label>
              <ReactSelect
                isMulti
                name='requiredLevels'
                placeholder='Chọn trình độ yêu cầu dành cho ứng viên...'
                options={levels.map(lv => ({ value: lv._id, label: lv.name }))}
                value={levels
                  .filter(lv => input.requiredLevels.includes(lv._id))
                  .map(lv => ({ value: lv._id, label: lv.name }))
                }
                onChange={(selectedOptions) =>
                  setInput(prev => ({
                    ...prev,
                    requiredLevels: selectedOptions.map(opt => opt.value)
                  }))
                }
                className="my-1 border border-gray-800 rounded"
              />
            </div>
            <div>
              <Label>Mức lương</Label>
              <Input
                type='text'
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
              <Label>Hình thức làm việc</Label>
              <Input
                type='text'
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
              <Label>Số lượng tuyển</Label>
              <Input
                type='text'
                name='quantity'
                value={input.quantity}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1 rounded'
              />
            </div>
            <div>
                <Label>Thời hạn nộp hồ sơ</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal my-1 rounded"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                        {input.duration
                          ? format(new Date(input.duration), "dd/MM/yyyy")
                          : "Chọn ngày"
                        }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={input.duration ? new Date(input.duration) : undefined}
                      onSelect={(date) =>{
                        if(date) {
                          setInput((prev) => ({
                            ...prev,
                            duration: date ? format(date, "yyyy-MM-dd") : "",
                          }));
                          setOpen(false);
                        }
                      }}
                      defaultMonth={new Date()}
                      initialFocus
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
            </div>
            <div>
              <Label>Công ty</Label>
              {
                companies.length > 0 && (
                  <Select onValueChange={changeSelectHandler}>
                    <SelectTrigger className="w-full border border-gray-800 rounded my-1 py-5 px-3">
                      <SelectValue placeholder="Chọn một công ty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className='bg-white'>
                        {
                          companies.map((company) => (
                            <SelectItem key={company._id} value={company?.name?.toLowerCase()}>
                              {company.name}
                            </SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )
              }
            </div>
          </div>
          {
            loading
              ?
              <Button variant='outline' className="w-full my-4 rounded flex items-center justify-center">
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Xin hãy đợi giây lát
              </Button>
              :
              <Button type='submit' variant='outline' className='w-full mt-6 text-gray-100 bg-blue-700 hover:bg-blue-500 rounded px-6 py-2 font-medium'>
                Tạo công việc
              </Button>
          }
          {
            companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>
              *Hãy đăng kí công ty đầu tiên, sau đó đăng một công việc cần tuyển.
            </p>
          }
        </form>
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default PostJob;
