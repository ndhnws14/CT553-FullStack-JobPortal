import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, CalendarIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Button } from '../ui/button.jsx';
import axios from 'axios';
import { JOB_API_END_POINT, LEVEL_API_END_POINT, TECHSKILL_API_END_POINT } from '@/utills/constant.js';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import useGetJobById from '@/hooks/useGetJobById.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const EmployerJobUpdate = () => {
  const params = useParams();
  useGetJobById(params.id);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "",
    quantity: "",
    benefit: "",
    duration: "",
    requiredSkills: [],
    requiredLevels: [],
  });

  const { singleJob } = useSelector(store => store.job);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [techSkills, setTechSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${TECHSKILL_API_END_POINT}/skills?limit=100`, { withCredentials: true });
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
    if (singleJob) {
      setInput({
        title: singleJob.title || "",
        description: singleJob.description || "",
        requirements: singleJob.requirements || "",
        salary: singleJob.salary || "",
        jobType: singleJob.jobType || "",
        quantity: singleJob.quantity || "",
        benefit: singleJob.benefit || "",
        duration: format(singleJob.duration, "yyyy-MM-dd") || "",
        requiredSkills: Array.isArray(singleJob.requiredSkills)
                          ? singleJob.requiredSkills.map(skill =>
                              typeof skill === "string" ? skill : skill._id )
        : [],
        requiredLevels: Array.isArray(singleJob.requiredLevels)
                          ? singleJob.requiredLevels.map(level =>
                              typeof level === "string" ? level : level._id )
        : [],
      });
    }
  }, [singleJob]);

  const techSkillOptions = techSkills.map(skill => ({
    value: skill._id,
    label: skill.name
  }));

  return (
    <div>
      <div className='max-w-6xl mx-auto'>
        <div className='relative flex items-center justify-center mt-4'>
          <Button onClick={() => navigate("/recruiter/jobs")} className='absolute left-0 ml-4'>
            <ArrowLeft />
          </Button>
          <h1 className='font-bold text-2xl text-center'>Chỉnh sửa công việc tuyển dụng</h1>
        </div>
        <p className='border-b-2 border-b-gray-300 my-4'></p>
        <form onSubmit={submitHandler} className='bg-white border border-gray-500 rounded-xl p-6 max-w-4xl mx-auto dark:text-gray-700'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Công việc</Label>
              <Textarea
                name='title'
                value={input?.title}
                onChange={changeEventHandler}
                className='my-1 rounded'
              />
            </div>
            <div>
              <Label>Mô tả công việc</Label>
              <Textarea
                name='description'
                value={input?.description}
                onChange={changeEventHandler}
                className='my-1 rounded'
              />
            </div>
            <div>
              <Label>Yêu cầu công việc</Label>
              <Textarea
                name='requirements'
                value={input?.requirements}
                onChange={changeEventHandler}
                className='my-1 rounded'
              />
            </div>
            <div>
              <Label>Lợi ích</Label>
              <Textarea
                name='benefit'
                value={input?.benefit}
                onChange={changeEventHandler}
                className='my-1 rounded'
              />
            </div>
            <div>
              <Label>Kỹ năng công nghệ yêu cầu</Label>
              <ReactSelect
                  isMulti
                  options={techSkillOptions}
                  value={techSkillOptions.filter(option => input.requiredSkills.includes(option.value))}
                  onChange={(selectedOptions) => {
                    setInput(prev => ({
                        ...prev,
                        requiredSkills: selectedOptions.map(option => option.value)
                    }));
                  }}
                  className='my-1 border border-gray-800 rounded'
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
                value={input?.salary}
                onChange={changeEventHandler}
                className='my-1 rounded'
              />
            </div>
            <div>
              <Label>Hình thức làm việc</Label>
              <Input
                type='text'
                name='jobType'
                value={input?.jobType}
                onChange={changeEventHandler}
                className='my-1 rounded'
              />
            </div>
            <div>
              <Label>Số lượng tuyển</Label>
              <Input
                type='text'
                name='quantity'
                value={input?.quantity}
                onChange={changeEventHandler}
                className='rounded'
              />
            </div>
            <div>
                <Label>Thời hạn nộp hồ sơ</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal rounded"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {input.duration ? format(new Date(input.duration), "dd/MM/yyyy") : "Chọn ngày"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={input.duration ? new Date(input.duration) : undefined}
                            onSelect={(date) =>{
                                setInput((prev) => ({
                                    ...prev,
                                    duration: date ? format(date, "yyyy-MM-dd") : "",
                                }));
                                setOpen(false);
                              }
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>
          {
            loading
              ?
              <Button variant='outline' className="w-full my-4 rounded flex items-center justify-center">
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Xin hãy đợi giây lát
              </Button>
              :
              <Button type='submit' className='w-full mt-6 text-white bg-blue-700 hover:bg-blue-500 rounded px-6 py-2 font-medium'>
                Cập nhật
              </Button>
          }
        </form>
      </div>
    </div>
  );
};

export default EmployerJobUpdate;
