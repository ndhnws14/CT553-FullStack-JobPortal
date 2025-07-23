import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { CV_API_END_POINT, TECHSKILL_API_END_POINT, USER_API_END_POINT } from '@/utills/constant';
import { setUser } from '@/redux/authSlice';
import RequestSkillDialog from '../RequestSkillDialog';
import { startLoading, stopLoading } from '@/redux/uiSlice';
import { setCV } from '@/redux/cvSlice';

const CVSetup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const selectedTemplate = searchParams.get('template');
    const [input, setInput] = useState({
        fullname: "",
        office: "",
        template: selectedTemplate,
        file: null,
        birthday: "",
        sex: "",
        phoneNumber: "",
        email: "",
        github: "",
        address: "",
        hobbies: "",
        target: "",
        certificate: "",
        education: {
            schoolName: "",
            course: "",
            major: "",
            graduate: ""
        },
        skillGroups: [],
        experiences: [],
    });
    const [techSkills, setTechSkills] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const handleNavigate = (path) => {
        dispatch(startLoading());
        window.location.href = (path);
    };

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const changeFileHandler = (e) => {
        setInput({...input, file: e.target.files?.[0]});
    }

    const addSkillHandler = () => {
        setInput((prevState) => ({
            ...prevState,
            skillGroups: [...prevState.skillGroups, { category: "", skills: [] }]
        }));
    };

    const removeSkillHandler = (index) => {
        const updatedSkills = [...input.skillGroups];
        updatedSkills.splice(index, 1);
        setInput((prevState) => ({
            ...prevState,
            skillGroups: updatedSkills
        }));
    };


    const changeEducationHandler = (e) => {
        const { name, value } = e.target;
        setInput((prevState) => ({
            ...prevState,
            education: {
                ...prevState.education,
                [name]: value
            }
        }));
    };

    const changeExperienceHandler = (e, index) => {
        const { name, value } = e.target;
        const updatedExperiences = [...input.experiences];
        updatedExperiences[index] = { ...updatedExperiences[index], [name]: value };
        setInput((prevState) => ({
            ...prevState,
            experiences: updatedExperiences
        }));
    };

    const addExperienceHandler = () => {
        setInput((prevState) => ({
            ...prevState,
            experiences: [...prevState.experiences, { completionTime: "", projectName: "", description: "", link: "", member: "", technology: "", function: "" }]
        }));
    };

    const removeExperienceHandler = (index) => {
        const updatedExperiences = [...input.experiences];
        updatedExperiences.splice(index, 1);
        setInput((prevState) => ({
            ...prevState,
            experiences: updatedExperiences
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("office", input.office);
        formData.append("birthday", input.birthday);
        formData.append("sex", input.sex);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("email", input.email);
        formData.append("github", input.github);
        formData.append("address", input.address);
        formData.append("hobbies", input.hobbies);
        formData.append("target", input.target);
        formData.append("certificate", input.certificate);
        formData.append("template", input.template);
        formData.append("education", JSON.stringify(input.education));
        formData.append("experiences", JSON.stringify(input.experiences));
        formData.append("skillGroups", JSON.stringify(input.skillGroups));
        if(input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(startLoading());

            const res = await axios.post(`${CV_API_END_POINT}/create-cv`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });
    
            if(res.data.success) {
                dispatch(setCV(res.data.cv));
                const userRes = await axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true });
                dispatch(setUser(userRes.data.user));

                navigate(`/my-cv/${res.data.cv._id}`);
                toast.success(res.data.message);
            } else {
                toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
            } 
        } catch (error) {
            console.log(error);
            toast.error(error.response.data?.message || "Đã có lỗi xảy ra từ server.");
        } finally {
            dispatch(stopLoading());
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
        setTimeout(() => {
            dispatch(stopLoading());
        }, 800)
    }, [dispatch]);

  return (
    <div className='max-w-6xl mx-auto dark:text-gray-700'>
        <div className="relative flex items-center justify-center mt-2">
            <Button
                type="button"
                onClick={() => handleNavigate("/create-cv")}
                className="absolute left-0 flex items-center gap-2 dark:text-gray-100"
            >
                <ArrowLeft />
            </Button>
            <h1 className="font-bold text-xl dark:text-gray-100 text-center">Thiết Lập Hồ Sơ - CV</h1>
        </div>
        <p className='border-b-2 border-b-gray-300 py-2'></p>
        <div className="flex items-center justify-between m-4">
            <div className="flex items-center gap-4">
                <Label className="text-blue-800 font-semibold">Chọn mẫu CV:</Label>
                <select
                    name="template"
                    value={input.template}
                    onChange={changeEventHandler}
                    className="border rounded-xl px-3 py-2"
                >
                    <option value="classic">Cổ điển</option>
                    <option value="modern">Hiện đại</option>
                    <option value="minimal">Tối giản</option>
                    <option value="creative">Sáng tạo</option>
                </select>
            </div>

            <Button
                variant="outline"
                className="border-gray-800 text-gray-700 dark:text-gray-100 rounded-xl hover:bg-gray-200"
                onClick={() => setOpenDialog(true)}
            >
                + Yêu cầu thêm kỹ năng
            </Button>

            <RequestSkillDialog open={openDialog} setOpen={setOpenDialog} />
        </div>
        <form onSubmit={submitHandler} className="max-w-3xl mx-auto p-4 bg-white rounded shadow space-y-6">
            <div>
                <label className="block font-semibold mb-1" htmlFor="fullname">Họ Và Tên</label>
                <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Họ Và Tên"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="office">Vị trí ứng tuyển</label>
                <input
                    id="office"
                    name="office"
                    type="text"
                    placeholder="Vị trí ứng tuyển"
                    value={input.office}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                    />
            </div>

            <div>
                <label className="block font-semibold mb-1">Ảnh đại diện</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="border rounded px-3 py-1"
                />
                {input.file && (
                <img
                    src={URL.createObjectURL(input.file)}
                    alt="Avatar Preview"
                    className="mt-2 w-32 h-40 object-cover rounded border"
                />
                )}
            </div>

            <fieldset className="border rounded p-4">
                <legend className="font-semibold mb-2">Thông tin cá nhân</legend>

                <div className="mb-3">
                <label className="block mb-1" htmlFor="birthday">Ngày sinh</label>
                <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={input.birthday}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
                </div>

                <div className="mb-3">
                <label className="block mb-1" htmlFor="sex">Giới tính</label>
                <input
                    id="sex"
                    name="sex"
                    type="text"
                    placeholder="Nam/Nữ"
                    value={input.sex}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
                </div>

                <div className="mb-3">
                <label className="block mb-1" htmlFor="phoneNumber">Số điện thoại</label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Số điện thoại"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
                </div>

                <div className="mb-3">
                <label className="block mb-1" htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
                </div>

                <div className="mb-3">
                <label className="block mb-1" htmlFor="github">Github</label>
                <input
                    id="github"
                    name="github"
                    type="url"
                    placeholder="Link Github"
                    value={input.github}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
                </div>

                <div>
                <label className="block mb-1" htmlFor="address">Địa chỉ</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Địa chỉ"
                    value={input.address}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
                </div>
            </fieldset>

            <fieldset className="border rounded p-4">
                <legend className="font-semibold mb-2">Kỹ năng</legend>

                <button
                    type="button"
                    onClick={addSkillHandler}
                    className="mb-4 px-3 py-1 bg-blue-500 text-white rounded"
                >
                    + Thêm nhóm kỹ năng
                </button>

                {input.skillGroups.map((group, i) => (
                <div key={i} className="mb-4 border p-3 rounded relative">
                    <button
                        type="button"
                        onClick={() => removeSkillHandler(i)}
                        className="absolute top-2 right-2 text-red-600 font-bold"
                        aria-label="Xóa nhóm kỹ năng"
                    >
                        &times;
                    </button>

                    <input
                        type="text"
                        name="category"
                        placeholder="Tên nhóm kỹ năng"
                        value={group.category}
                        onChange={(e) => {
                            const updated = [...input.skillGroups];
                            updated[i].category = e.target.value;
                            setInput((prev) => ({ ...prev, skillGroups: updated }));
                        }}
                        className="w-full border rounded px-3 py-2 mb-2 mt-6"
                    />

                    <ReactSelect
                        isMulti
                        name="skills"
                        options={techSkills.map(skill => ({ value: skill._id, label: skill.name }))}
                        value={techSkills
                            .filter(skill => group.skills?.includes(skill._id))
                            .map(skill => ({ value: skill._id, label: skill.name }))}
                        onChange={(selectedOptions) => {
                            const selectedSkillIds = selectedOptions.map(o => o.value);
                            const updated = [...input.skillGroups];
                            updated[i].skills = selectedSkillIds;
                            setInput((prev) => ({ ...prev, skillGroups: updated }));
                        }}
                        placeholder="Chọn kỹ năng"
                    />
                </div>
                ))}
            </fieldset>

            <div>
                <label className="block font-semibold mb-1" htmlFor="certificate">Chứng chỉ</label>
                <textarea
                    id="certificate"
                    name="certificate"
                    placeholder="Các chứng chỉ, chứng nhận..."
                    value={input.certificate}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="hobbies">Sở thích</label>
                <input
                    id="hobbies"
                    name="hobbies"
                    type="text"
                    placeholder="Liệt kê các sở thích"
                    value={input.hobbies}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="target">Mục tiêu nghề nghiệp</label>
                <textarea
                    id="target"
                    name="target"
                    placeholder="Mục tiêu nghề nghiệp"
                    value={input.target}
                    onChange={changeEventHandler}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                />
            </div>

            <fieldset className="border rounded p-4">
                <legend className="font-semibold mb-2">Học vấn</legend>
                <input
                    name="schoolName"
                    type="text"
                    placeholder="Tên trường"
                    value={input.education.schoolName}
                    onChange={changeEducationHandler}
                    className="w-full border rounded px-3 py-2 mb-3"
                />
                <input
                    name="course"
                    type="text"
                    placeholder="Khóa học"
                    value={input.education.course}
                    onChange={changeEducationHandler}
                    className="w-full border rounded px-3 py-2 mb-3"
                />
                <input
                    name="major"
                    type="text"
                    placeholder="Ngành học"
                    value={input.education.major}
                    onChange={changeEducationHandler}
                    className="w-full border rounded px-3 py-2 mb-3"
                />
                <textarea
                    name="graduate"
                    placeholder="Mô tả quá trình học hoặc thành tích"
                    value={input.education.graduate}
                    onChange={changeEducationHandler}
                    className="w-full border rounded px-3 py-2"
                rows={3}
                />
            </fieldset>

            <fieldset className="border rounded p-4">
                <legend className="font-semibold mb-2">Kinh nghiệm làm việc</legend>

                <button
                    type="button"
                    onClick={addExperienceHandler}
                    className="mb-4 px-3 py-1 bg-blue-500 text-white rounded"
                >
                    + Thêm kinh nghiệm
                </button>

                {input.experiences.map((exp, i) => (
                <div key={i} className="mb-4 border p-3 rounded relative">
                    <button
                        type="button"
                        onClick={() => removeExperienceHandler(i)}
                        className="absolute top-2 right-2 text-red-600 font-bold"
                        aria-label="Xóa kinh nghiệm"
                    >
                        &times;
                    </button>

                    <input
                        name="completionTime"
                        type="text"
                        placeholder="Thời gian bắt đầu - Thời gian kết thúc"
                        value={exp.completionTime}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2 mb-2 mt-6"
                    />

                    <input
                        name="projectName"
                        type="text"
                        placeholder="Tên dự án"
                        value={exp.projectName}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2 mb-2"
                    />

                    <input
                        name="description"
                        type="text"
                        placeholder="Mô tả dự án"
                        value={exp.description}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2 mb-2"
                    />

                    <input
                        name="link"
                        type="url"
                        placeholder="Link Github dự án"
                        value={exp.link}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2 mb-2"
                    />

                    <input
                        name="member"
                        type="text"
                        placeholder="Số lượng thành viên"
                        value={exp.member}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2 mb-2"
                    />

                    <textarea
                        name="technology"
                        placeholder="Công nghệ sử dụng"
                        value={exp.technology}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2"
                    rows={3}
                    />

                    <textarea
                        name="function"
                        placeholder="Mô tả chức năng"
                        value={exp.function}
                        onChange={(e) => changeExperienceHandler(e, i)}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>
                ))}
            </fieldset>

            <div className="text-center">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
                >
                    Lưu thông tin
                </button>
            </div>
        </form>
    </div>
  )
}

export default CVSetup;