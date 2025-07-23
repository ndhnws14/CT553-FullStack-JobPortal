import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { MessageCircleCode } from 'lucide-react';

const ViewChatbot = () => {
    const [open, setOpen] = useState(false);
  return (
     <>
      {open && <Chatbot onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-700"
      >
        <MessageCircleCode />
      </button>
    </>
  )
}

export default ViewChatbot;