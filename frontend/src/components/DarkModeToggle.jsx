import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (dark) => {
    document.documentElement.classList.toggle('dark', dark);
  };

  // Load trạng thái từ localStorage khi khởi động
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const isDarkMode = theme === 'dark';
    setIsDark(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  // Cập nhật theme khi người dùng nhấn nút
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-16 h-9 rounded-full flex items-center px-1 transition-colors duration-300 ${
        isDark ? 'bg-zinc-500' : 'bg-blue-400'
      } relative`}
    >
      <div className="w-7 h-7 flex items-center justify-center z-10">
        <svg
          className={`w-5 h-5 ${isDark ? 'text-zinc-300' : 'text-blue-600'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 4V2M12 22v-2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 18a6 6 0 100-12 6 6 0 000 12z" />
        </svg>
      </div>

      <div className="w-7 h-7 flex items-center justify-center z-10 ml-auto">
        <svg
          className={`w-5 h-5 ${isDark ? 'text-white' : 'text-zinc-300'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21.75 15.5A9 9 0 0110.5 2.25a7 7 0 000 19.5 9 9 0 0111.25-6.25z" />
        </svg>
      </div>

      <div
        className={`absolute top-1 left-1 w-7 h-7 rounded-full transition-transform duration-300 shadow-md ${
          isDark ? 'translate-x-7 bg-zinc-900' : 'translate-x-0 bg-white'
        }`}
      />
    </button>
  );
};

export default DarkModeToggle;
