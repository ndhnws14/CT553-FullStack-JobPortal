import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, X } from "lucide-react";
import axios from "axios";
import { CHATBOT_API_END_POINT } from "@/utills/constant";
import Job from "../Job";
import CompanyCardPreview from "../CompanyCardPreview";
import UserCardPreview from "../UserCardPreview";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Chào bạn! Bạn cần tìm thông tin gì về việc làm hoặc công ty?",
    },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(CHATBOT_API_END_POINT, {
        message: input,
      });

      setMessages([...newMessages, res.data.reply]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Có lỗi khi gọi chatbot. Vui lòng thử lại." },
      ]);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderAssistantMessage = (msg) => {
    if (typeof msg.content === "string") {
      return <div>{msg.content}</div>;
    }

    if (msg.content.type === "job_list") {
        return (
            <div className="space-y-2">
              <h2 className="text-md font-medium my-1">Danh sách các công việc theo yêu cầu của bạn </h2>
              {msg.content.data.map((job) => (
                  <Job key={job._id} job={job} />
              ))}
            </div>
        );
    }

    if (msg.content.type === "company_list") {
      return (
        <div className="space-y-2">
          <h2 className="text-md font-medium my-1">Danh sách các công ty theo yêu cầu của bạn </h2>
          {msg.content.data.map((company) => (
            <CompanyCardPreview key={company._id} company={company} />
          ))}
        </div>
      );
    }

    if (msg.content.type === "user_list") {
  return (
    <div className="space-y-2">
      <h2 className="text-md font-medium my-1">Danh sách các ứng viên theo yêu cầu của bạn </h2>
      {msg.content.data.map((user) => (
        <UserCardPreview key={user._id} user={user} />
      ))}
    </div>
  );
}


    return <div>[Không xác định phản hồi]</div>;
  };

  return (
    <div className="fixed bottom-20 right-6 w-[360px] sm:w-[440px] bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl z-50 p-0 border border-gray-300 dark:border-zinc-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">🤖 Trợ lý Việc làm</h2>
            <button onClick={onClose} className="hover:text-red-400 transition">
                <X size={20} />
            </button>
        </div>

        {/* Chat content */}
        <div className="flex-1 overflow-y-auto space-y-2 text-sm px-4 py-3 max-h-[400px] scrollbar-thin">
            {messages.map((msg, idx) => (
            <div
                key={idx}
                className={`p-2 rounded-lg max-w-[90%] whitespace-pre-line ${
                msg.role === "user"
                    ? "ml-auto bg-gray-200 text-right dark:bg-zinc-600"
                    : "bg-blue-100 text-left dark:bg-blue-800 dark:text-white"
                }`}
            >
                {msg.role === "user" ? msg.content : renderAssistantMessage(msg)}
            </div>
            ))}
            <div ref={messageEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 px-4 py-3 border-t dark:border-zinc-600">
            <Input
                placeholder="Nhập câu hỏi..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="rounded-xl"
            />
            <Button
                variant="outline"
                className="rounded-xl bg-blue-700 text-white hover:bg-blue-800 hover:text-white"
                onClick={sendMessage}
            >
                <SendHorizonal />
            </Button>
        </div>
        </div>
  );
};

export default Chatbot;
