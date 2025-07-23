import React, { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import ReactSelect from 'react-select';
import { debounce } from 'lodash';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from './ui/select';
import { Button } from './ui/button';
import axios from 'axios';
import { LEVEL_API_END_POINT, TECHSKILL_API_END_POINT } from '@/utills/constant';

const regions = [
  "An Giang", "Cà Mau", "Cần Thơ", "Đồng Tháp", "TP. Hồ Chí Minh", "Vĩnh Long" 
];

const JobSearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [techSkills, setTechSkills] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [levels, setLevels] = useState([]);
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ keyword, selectedTechs, location, levels: selectedLevels });
    }
  };

  const resetFilters = () => {
    setKeyword('');
    setSelectedTechs([]);
    setSelectedLevels([]);
    setLocation('');
    if (onSearch) {
      onSearch({ keyword: '', selectedTechs: [], levels: [], location: '', page: 1 });
    }
  };


  useEffect(() => {
    const isAllEmpty =
      keyword.trim() === '' &&
      selectedTechs.length === 0 &&
      selectedLevels.length === 0 &&
      location.trim() === '';

    if (isAllEmpty && onSearch) {
      const resetSearch = debounce(() => {
        onSearch({ keyword: '', selectedTechs: [], levels: [], location: '', page: 1 });
      }, 300); // 300ms debounce

      resetSearch();
      return () => resetSearch.cancel();
    }
  }, [keyword, selectedTechs, selectedLevels, location]);

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

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axios.get(`${LEVEL_API_END_POINT}/get`);
        if (res.data.success) {
          setLevels(res.data.levels);
        }
      } catch (err) {
        console.error('Lỗi khi tải level:', err);
      }
    };
    fetchLevels();
  }, []);

  return (
    <div className="w-full p-4 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row items-center gap-3 w-full">
        {/* Tìm kiếm từ khóa */}
        <div className="relative flex-[2] w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Tìm kiếm cơ hội việc làm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 h-[44px] bg-gray-50 dark:bg-[#F9FAFB] dark:text-gray-800 text-gray-800 placeholder:text-gray-500 border border-gray-300 hover:border-[#2563EB] dark:border-gray-600 rounded text-base"
          />
        </div>

        {/* Select kỹ năng */}
        <div className="flex-[1.2] w-full">
          <ReactSelect
            isMulti
            name="requiredSkills"
            placeholder="Công nghệ - kỹ năng"
            options={techSkills.map(skill => ({ value: skill._id, label: skill.name }))}
            className="text-sm dark:text-gray-800 rounded"
            classNamePrefix="select"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: '44px',
                backgroundColor: '#F9FAFB',
                borderColor: state.isFocused ? '#2563EB' : '#D1D5DB',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#2563EB',
                },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 50,
              }),
            }}
            onChange={(selectedOptions) => {
              const selectedSkillIds = selectedOptions.map(option => option.value);
              setSelectedTechs(selectedSkillIds);
            }}
            value={techSkills
              .filter(skill => selectedTechs.includes(skill._id))
              .map(skill => ({ value: skill._id, label: skill.name }))
            }
          />
        </div>

        {/* Select cấp bậc (multi-select) */}
        <div className="flex-[1.2] w-full">
          <ReactSelect
            isMulti
            name="levels"
            placeholder="Cấp bậc"
            options={levels.map(lv => ({ value: lv._id, label: lv.name }))}
            className="text-sm dark:text-gray-800 rounded"
            classNamePrefix="select"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: '44px',
                backgroundColor: '#F9FAFB',
                borderColor: state.isFocused ? '#2563EB' : '#D1D5DB',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#2563EB',
                },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 50,
              }),
            }}
            onChange={(selectedOptions) => {
              const selectedLevelIds = selectedOptions.map(option => option.value);
              setSelectedLevels(selectedLevelIds);
            }}
            value={levels
              .filter(level => selectedLevels.includes(level._id))
              .map(level => ({ value: level._id, label: level.name }))
            }
          />
        </div>

        {/* Select địa điểm */}
        <div className="flex-[1] w-full">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger
              className="w-full h-[44px] border border-gray-300 hover:border-[#2563EB] dark:border-gray-600 bg-white dark:bg-[#F9FAFB] text-base rounded"
            >
              <span className={location ? "text-gray-800" : "text-gray-500 text-sm"}>
                {location ? location : "Địa điểm"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {regions.map((region, idx) => (
                <SelectItem key={idx} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-3 items-center justify-end mt-2 lg:mt-0">
          {/* Nút tìm kiếm */}
          <Button
            onClick={handleSearch}
            className="h-[44px] px-6 font-semibold text-white bg-[#2563EB] hover:bg-[#1E40AF] rounded transition-all"
          >
            Tìm kiếm
          </Button>

          {/* Nút xóa lọc */}
          <Button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-200"
          >
            <Trash2 />
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobSearchBar;
