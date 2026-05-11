# GeekJobs – IT Recruitment Platform based on Tech Stack

## 📌 Overview

GeekJobs is a full-stack IT recruitment platform designed specifically for the technology industry.

Unlike traditional recruitment websites, GeekJobs connects candidates, jobs, and recruiters based on technical skills and technology stacks rather than generic job titles.

The platform allows developers to search for jobs using programming languages, frameworks, and technologies such as ReactJS, NodeJS, Python, Docker, etc.

---

# 🚀 Technical Highlights

- JWT Authentication & Role-based Authorization (RBAC)
- RESTful API Architecture
- Controller-Service Pattern
- Real-time Notification using Socket.IO
- Recommendation System using FastAPI + SentenceTransformers
- Pagination, Filtering & Search Optimization
- MongoDB Indexing
- File Upload with Multer
- Security Middleware (Helmet, Rate Limit)
- Responsive UI with TailwindCSS + Shadcn/UI

---

# 🏗️ System Architecture

## Frontend
- ReactJS
- Redux Toolkit
- TailwindCSS
- Shadcn/UI
- Socket.IO Client

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

## AI Recommendation Service
- FastAPI
- SentenceTransformers
- Cosine Similarity
- Collaborative Filtering

---
# 🎯 Main Features

## 👩‍💻 Candidate Features

- Register/Login with Email & Google
- Create and manage CV
- Search jobs by tech stack
- Save jobs & follow companies
- Apply for jobs
- Receive real-time notifications
- Get personalized job recommendations
- Chatbot support
- Dark/Light mode

---

## 🏢 Recruiter Features

- Company management
- Create and manage job postings
- Review candidate CVs
- Schedule interviews
- Manage application status
- View analytics dashboard
- Receive candidate recommendations

---

## 👨‍💼 Admin Features

- Manage tech skills
- Manage users, companies, jobs
- Monitor system statistics
- Approve requested skills

---

# 🤖 Recommendation System

The recommendation system is implemented as a separate FastAPI microservice.

### Features:
- Content-based Filtering
- Collaborative Filtering
- Rule-based Candidate Scoring
- Cosine Similarity using SentenceTransformers

---

# 🗂️ Database Design

Main collections:
- User
- Company
- Job
- TechSkill
- Application
- Notification
- CV

---

# 🔐 Security Features

- JWT Authentication
- Role-based Authorization
- Password Hashing
- Rate Limiting
- Helmet Security Middleware
- Protected Routes

---

# ⚡ Performance Optimization

- Pagination
- MongoDB Indexing
- Optimized Populate Queries
- Service Layer Refactoring

---

# 📷 Demo

<img width="1829" height="876" alt="Screenshot 2025-08-11 230213" src="https://github.com/user-attachments/assets/a81ffd38-9d76-4874-9561-6424248703d4" />

---
  
# 🛠️ Install project

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
    
# 📌 Future Improvements
- Resume Builder
- AI Career Suggestion
- Learning Recommendation System
- Mobile App (React Native / Flutter)
- Docker Deployment
- Redis Caching

---

# 👨‍💻 Author

Nguyễn Đông Hồ - Software Engineering Student – Can Tho University

---