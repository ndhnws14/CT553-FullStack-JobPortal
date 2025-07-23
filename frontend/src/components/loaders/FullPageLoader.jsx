import React from 'react';

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-100 z-50 flex items-center justify-center">
        <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
    </div>
  )
}

export default FullPageLoader;