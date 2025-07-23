import React from 'react';

const GuideLayout = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white">{title}</h1>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">{children}</div>
    </div>
  );
};

export default GuideLayout;
