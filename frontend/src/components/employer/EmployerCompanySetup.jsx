import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button.jsx';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/input.jsx';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { COMPANY_API_END_POINT } from '@/utills/constant';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById.jsx';
import { Textarea } from '../ui/textarea.jsx';

const regions = [
  "An Giang", "Cà Mau", "Cần Thơ", "Đồng Tháp", "TP. Hồ Chí Minh", "Vĩnh Long" 
];

const EmployerCompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        abbreviationName: "",
        description: "",
        field: "",
        website: "",
        location: "",
        address: "",
        email: "",
        hotline: "",
        file: null,
        background: null,
        logoPreview: "",
        backgroundPreview: ""
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]:e.target.value})
    }
    const changeFileHandler = (e) => {
        const { name, files } = e.target;
        const file = files?.[0];

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setInput(prev => ({
            ...prev,
            [name]: file,
            [`${name}Preview`]: previewUrl
            }));
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", input.name);
        formData.append("abbreviationName", input.abbreviationName);
        formData.append("description", input.description);
        formData.append("field", input.field);
        formData.append("website", input.website);
        formData.append("location", input.location);
        formData.append("address", input.address);
        formData.append("email", input.email);
        formData.append("hotline", input.hotline);
        if (input.file) {
            formData.append("logo", input.file);
        }
        if (input.background) {
            formData.append("background", input.background);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials:true
            });

            if(res.data.success){
                toast.success(res.data.message);
                navigate("/recruiter/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data?.message);
        } finally{
            setLoading(false);
        }  
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            abbreviationName: singleCompany.abbreviationName || "",
            description: singleCompany.description || "",
            field: singleCompany.field || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            address: singleCompany.address || "",
            email: singleCompany.email || "",
            hotline: singleCompany.hotline || "",
            file: null,
            background: null,
            logoPreview: singleCompany.logo || "",
            backgroundPreview: singleCompany.background || ""
        });
    }, [singleCompany]);

  return (
    <div className='max-w-6xl mx-auto'>
        <div className='relative flex items-center justify-center mt-4'>
            <Button 
                type="button" 
                onClick={(e) =>  { e.preventDefault(); navigate("/recruiter/companies"); }} 
                className='absolute left-0 ml-4'
            >
                <ArrowLeft/>
            </Button>
            <h1 className='font-bold text-2xl text-center'>Thiết lập công ty</h1>
        </div>
        <p className='border-b-2 border-b-gray-300 my-4'></p>
        <form onSubmit={submitHandler} className='bg-white border border-gray-500 rounded-xl p-6 max-w-4xl mx-auto dark:text-gray-700'>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label>Tên công ty</Label>
                    <Textarea
                        type='text'
                        name='name'
                        className='rounded-xl'
                        value={input.name}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Mô tả</Label>
                    <Textarea
                        type='text'
                        name='description'
                        className='rounded-xl'
                        value={input.description}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Tên viết tắt</Label>
                    <Input
                        type='text'
                        name='abbreviationName'
                        className='rounded-xl'
                        value={input.abbreviationName}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Khu vực</Label>
                    <select
                        name="location"
                        value={input.location}
                        onChange={changeEventHandler}
                        className="w-full border border-gray-800 rounded-xl py-2 px-3"
                    >
                        <option value="">-- Chọn khu vực --</option>
                        {regions.map((region, index) => (
                        <option key={index} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <Label>Lĩnh vực hoạt động</Label>
                    <Textarea
                        type='text'
                        name='field'
                        className='rounded-xl'
                        value={input.field}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Địa chỉ</Label>
                    <Textarea
                        type='text'
                        name='address'
                        className='rounded-xl'
                        value={input.address}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Website</Label>
                    <Input
                        type='text'
                        name='website'
                        className='rounded-xl'
                        value={input.website}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        type='text'
                        name='email'
                        className='rounded-xl'
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Hotline</Label>
                    <Input
                        type='text'
                        name='hotline'
                        className='rounded-xl'
                        value={input.hotline}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Logo</Label>
                    <Input
                        type="file"
                        name="file"
                        accept="image/*"
                        className="w-full border-gray-300 rounded-xl py-2 px-3"
                        onChange={changeFileHandler}
                    />
                    {input.logoPreview && (
                        <img
                        src={input.logoPreview}
                        alt="Logo Preview"
                        className="mt-2 max-h-24 object-contain rounded"
                        />
                    )}
                </div>

                <div>
                    <Label>Ảnh nền</Label>
                    <Input
                        type="file"
                        name="background"
                        accept="image/*"
                        className="w-full border-gray-300 rounded-xl py-2 px-3"
                        onChange={changeFileHandler}
                    />
                    {input.backgroundPreview && (
                        <img
                        src={input.backgroundPreview}
                        alt="Background Preview"
                        className="mt-2 max-h-24 object-contain rounded"
                        />
                    )}
                </div>
            </div>
            {
                loading 
                ? 
                <Button variant='outline' className="w-full my-4 rounded-xl flex items-center justify-center"><Loader2 className="mr-2 w-4 h-4 animate-spin"/> Xin hãy đợi giây lát </Button> 
                : 
                <Button type='submit' className='w-full mt-6 text-white bg-blue-700 hover:bg-blue-500 rounded-xl px-6 py-2 font-medium'>Cập nhật</Button>
            }
        </form>
        <div className="h-10"></div> 
    </div>
  )
}

export default EmployerCompanySetup;