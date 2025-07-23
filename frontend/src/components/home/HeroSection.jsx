import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { startLoading } from '@/redux/uiSlice';
import CategorySuggest from './CategorySuggest';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();

    const searchJobHandler = () => {
        if (query) {
            dispatch(startLoading());
            window.location.href = `/browse?q=${encodeURIComponent(query)}`;
        } else {
            toast.warning("Vui lòng nhập từ khóa tìm kiếm!");
        }
    };

    return (
        <section className="py-12 px-6 relative overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="/assets/bg-blue-banner.jpeg"
                    alt="Light Background"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Content */}
            <div className="max-w-4xl mx-auto text-center flex flex-col gap-6">
                <span className="px-4 py-1.5 mx-auto rounded-full bg-white text-[#F83002] font-semibold text-sm shadow">
                    No. 1 Job Portal Website
                </span>

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
                    Tìm kiếm, ứng tuyển & <br />
                    nhận được <span className="bg-gradient-to-r from-orange-200 to-[#F83002] text-transparent bg-clip-text">công việc mơ ước</span> của bạn
                </h1>

                <motion.p
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                    }}
                    className="text-white text-base md:text-lg font-medium max-w-2xl mx-auto"
                >
                    "Bạn không chỉ tìm kiếm một công việc, mà đang xây dựng sự nghiệp của mình. Hãy kiên trì và tự tin!"
                </motion.p>


                <div className="relative w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm việc làm, công ty, kỹ năng"
                        className="w-full pl-5 pr-14 py-3 rounded-full shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder:text-gray-400 transition-all duration-300 focus:scale-[1.02]"
                    />
                    <Button
                        onClick={searchJobHandler}
                        className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-4 bg-blue-700 text-white hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>

                <div className="text-sm mt-2">
                    <CategorySuggest />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
