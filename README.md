GeekJobs – Website Tuyển dụng IT theo mô hình Tech Stack
📌 Giới thiệu
GeekJobs là website tuyển dụng chuyên biệt cho ngành công nghệ thông tin, được xây dựng dựa trên mô hình Tech Stack.
Khác với các nền tảng tuyển dụng chung chung, hệ thống này tập trung kết nối ứng viên ↔ công việc ↔ nhà tuyển dụng dựa trên công nghệ (Tech Skill) mà họ sử dụng.
Ứng viên có thể tìm kiếm việc làm theo ngôn ngữ lập trình, framework, hoặc công nghệ cụ thể, thay vì chỉ theo vị trí chung như Frontend Developer hay Backend Developer.
🎯 Mục tiêu
Hỗ trợ ứng viên IT tìm được công việc phù hợp với kỹ năng và định hướng nghề nghiệp.
Hỗ trợ nhà tuyển dụng dễ dàng tìm thấy ứng viên có kỹ năng sát yêu cầu công việc.
Xây dựng một nền tảng tuyển dụng cá nhân hóa, thông minh hơn các website truyền thống.
⚙️ Công nghệ sử dụng
  🖥️ Frontend
  ReactJS – Xây dựng giao diện
  Tailwind CSS + Shadcn/UI – Thiết kế UI hiện đại, responsive
  Redux Toolkit – Quản lý state
  Socket.IO Client – Thông báo realtime
  Nivo/Chart.js – Vẽ biểu đồ thống kê
  🛠️ Backend
  Node.js + Express.js – Xây dựng REST API
  MongoDB – Lưu trữ dữ liệu (NoSQL)
  Mongoose – ODM cho MongoDB
  Socket.IO – Hỗ trợ realtime notification
  Dialogflow – Tích hợp chatbot AI
  FastAPI + SentenceTransformers – Hệ thống gợi ý công việc & ứng viên (Python service)
🚀 Chức năng chính
  👩‍💻 Ứng viên
  Đăng ký, đăng nhập (Email/Google)
  Cập nhật thông tin cá nhân, thay đổi mật khẩu
  Tạo và quản lý hồ sơ (CV)
  Tìm kiếm công việc theo tech stack
  Xem chi tiết công việc, công ty
  Yêu thích, lưu công việc, theo dõi công ty
  Ứng tuyển công việc, quản lý trạng thái hồ sơ
  Xem gợi ý công việc phù hợp
  Chatbot tư vấn 24/7
  Dark mode / Light mode
  🏢 Nhà tuyển dụng
  Đăng ký, đăng nhập, đổi mật khẩu
  Đăng ký công ty, quản lý thông tin công ty
  Đăng tin tuyển dụng, chỉnh sửa, quản lý bài đăng
  Xem CV của ứng viên, cập nhật trạng thái ứng tuyển
  Lên lịch phỏng vấn, gửi thông báo cho ứng viên
  Xem thống kê số lượt xem công việc & công ty
  Nhận gợi ý ứng viên phù hợp
  👨‍💼 Quản trị viên
  Quản lý danh sách Tech Skill
  Quản lý công ty, công việc, người dùng
  Xem báo cáo thống kê toàn hệ thống
  Tiếp nhận yêu cầu thêm kỹ năng mới từ ứng viên
🤖 Hệ thống gợi ý
Hệ thống gợi ý được triển khai dưới dạng microservice (Python FastAPI):
Gợi ý công việc phù hợp cho ứng viên: Content-based Filtering → so sánh kỹ năng ứng viên với yêu cầu công việc bằng cosine similarity.
Gợi ý công việc tương tự: Xác định công việc giống nhau dựa trên vector kỹ năng.
Gợi ý cộng tác (Collaborative Filtering): Dựa vào lịch sử ứng tuyển để gợi ý công việc mà những người dùng tương tự đã ứng tuyển.
Gợi ý ứng viên phù hợp cho nhà tuyển dụng: Rule-based Scoring → so khớp kỹ năng với mức độ thành thạo (Cơ bản/Khá/Tốt) để tính điểm và xếp hạng.
🗂️ Mô hình dữ liệu (ERD)
  User (Ứng viên/Nhà tuyển dụng/Admin)
  Company
  Job
  TechSkill (bảng riêng để quản lý kỹ năng/công nghệ)
  Application (lưu đơn ứng tuyển và trạng thái)
  Notification
  CV
🛠️ Cài đặt & chạy thử
  1. Clone dự án:
    git clone https://github.com/<your-username>/geekjobs.git
    cd geekjobs
  2. Backend (Node.js + Express):
    cd backend
    npm install
    npm run dev
  3. Frontend (React + Vite):
    cd frontend
    npm install
    npm run dev
  4. Service gợi ý (FastAPI + Python):
    cd recommender
    pip install -r requirements.txt
    uvicorn main:app --reload
📌 Hướng phát triển
Thêm nhiều mẫu CV, cho phép ứng viên tự thiết kế CV
Gợi ý khóa học / tài liệu phù hợp để học thêm skill còn thiếu
Chatbot thông minh hơn, xử lý nhiều intent phức tạp
Ứng dụng di động (React Native / Flutter)
📷 Demo giao diện
<img width="1829" height="876" alt="Screenshot 2025-08-11 230213" src="https://github.com/user-attachments/assets/a81ffd38-9d76-4874-9561-6424248703d4" />
👨‍💻 Tác giả
Nguyễn Đông Hồ – Sinh viên ngành Kỹ thuật Phần mềm
Trường Đại học Cần Thơ
