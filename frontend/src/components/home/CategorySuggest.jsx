import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { startLoading } from '@/redux/uiSlice';
import { Button } from '../ui/button';
import axios from 'axios';
import { TECHSKILL_API_END_POINT } from '@/utills/constant';

const CategorySuggest = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [techSkills, setTechSkills] = useState([]);

    const quickSuggestions = ["Java", "NodeJS", "ReactJS", ".NET", "Python", "PHP", "Django"];
    const userSkills = user?.profile?.skills || [];

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        dispatch(startLoading());
        window.location.href = `/browse?q=${encodeURIComponent(query)}`;
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get(`${TECHSKILL_API_END_POINT}/skills?limit=100`);
                if (res.data.success) {
                    setTechSkills(res.data.skills);
                }
            } catch (err) {
                console.error("Lỗi khi tải kỹ năng:", err);
            }
        };
        fetchSkills();
    }, []);

    const hasSkills = !!user && userSkills.length > 0;

    // 🔁 Map user skill IDs → skill names
    const mappedSkills = userSkills
        .map((skillObj) => {
            const skillInfo = techSkills.find(skill => skill._id === skillObj.skill);
            return skillInfo?.name;
        })
        .filter(Boolean); // Remove undefined

    const suggestions = hasSkills && mappedSkills.length > 0 ? mappedSkills : quickSuggestions;

    return (
        <div className='text-gray-200 flex flex-wrap items-center justify-center gap-2'>
            Gợi ý:
            {suggestions.map((item, idx) => (
                <Button
                    key={idx}
                    onClick={() => searchJobHandler(item)}
                    variant="outline"
                    className="cursor-pointer rounded-full hover:bg-blue-800 transition"
                >
                    {item}
                </Button>
            ))}
        </div>
    );
};

export default CategorySuggest;
