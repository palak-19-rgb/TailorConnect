# ✂️ TailorConnect
<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io)
![JWT](https://img.shields.io/badge/JWT-black)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3-blue)
![Cloudinary](https://img.shields.io/badge/Cloudinary-4285F4)
![K6](https://img.shields.io/badge/K6-7D64FF)

</p>

> **An AI-powered production-ready MERN platform connecting customers with local tailors through intelligent discovery, secure identity verification, real-time communication, and complete order lifecycle management.**
---
## 🌐 Live Project
### 🚀 Live Demo
https://tailorconnect-gilt.vercel.app
### ⚙ Backend API
https://tailorconnect-backend.onrender.com
---
## 👩‍💻 Developer
**Palak Chugh**
**LinkedIn**
https://www.linkedin.com/in/palakchugh/
**GitHub**
https://github.com/palak-19-rgb
**LeetCode**
https://leetcode.com/u/palakkkkk/
---
# 🚀 Project Overview
TailorConnect is a production-grade MERN application designed to digitally modernize the traditional tailoring industry by connecting customers with verified local tailors through an AI-powered platform.
The application combines secure authentication, Aadhaar verification, intelligent tailor recommendations, real-time messaging, order tracking, portfolio management, and cloud-native deployment into a single scalable ecosystem.
Unlike traditional tailoring applications, TailorConnect integrates an AI assistant powered by Groq LLaMA 3.3 with Retrieval-Augmented Generation (RAG), allowing recommendations to be generated directly from live MongoDB tailor data rather than static prompts.
The project also emphasizes production engineering practices including API security, encryption, rate limiting, concurrent load testing, cloud deployment, and modular MVC architecture.
---
# ✨ Key Highlights
- 🔐 JWT Authentication with bcrypt password hashing
- 👥 Customer & Tailor role-based authorization
- 🤖 AI-powered Stitch chatbot using Groq LLaMA 3.3
- 🧠 Retrieval-Augmented Generation (RAG) with live MongoDB tailor retrieval
- 💬 Session-aware multi-turn AI conversations
- 📄 Aadhaar OCR verification using Tesseract.js
- 🔒 AES-256 encrypted Aadhaar storage
- ☁ Cloudinary-powered portfolio & profile management
- 🖼 Pinterest-style tailor portfolio with featured/signature images, cropping and category filtering
- 📍 India Post API integration for automatic city & state population from pincode
- 👔 Tailor CRM for customer management, measurements and delivery tracking
- 💬 Real-time Socket.IO messaging with persistent MongoDB history
- 📦 Five-stage order tracking pipeline
- 📧 Automated email notifications using Nodemailer
- 🛡 Helmet.js security headers
- 🚦 Tiered API rate limiting
- 🔑 Protected API routes using JWT middleware
- 🔄 Browser back-button logout protection
- ⏳ Profile lock after save with edit mode and 10-minute idle auto logout
- 📊 K6 load tested with concurrent users and WebSocket clients
- 🌍 Fully deployed using Vercel + Render + MongoDB Atlas
---
# 📊 Engineering Highlights
| Capability | Implementation |
|------------|----------------|
| Authentication | JWT (7-day expiry), bcrypt hashing, role-based route protection |
| AI Assistant | Groq LLaMA 3.3 (70B), Retrieval-Augmented Generation, live MongoDB retrieval, session memory |
| Identity Verification | Tesseract.js OCR + AES-256 encrypted Aadhaar storage |
| Real-Time Communication | Socket.IO rooms with persistent MongoDB history |
| Order Lifecycle | Pending → Cutting → Stitching → Ready → Delivered |
| Customer CRM | Customer management, measurements, delivery tracking, saved tailors |
| Portfolio Management | Cloudinary uploads, featured images, signature work, tag filtering, image cropping |
| Media Storage | Cloudinary CDN with secure cloud synchronization |
| Notifications | Nodemailer order status emails |
| Security | Helmet, JWT middleware, bcrypt, CORS, tiered API rate limiting |
| Performance Validation | K6 stress testing with concurrent APIs & Socket.IO |
| Deployment | Frontend on Vercel, Backend on Render, MongoDB Atlas |
---
# 🏛 System Architecture
```text
                           React + TypeScript
                                   │
                      Axios + JWT Interceptor
                                   │
                                   ▼
                     Express.js REST API (MVC)
                                   │
      ┌──────────────┬─────────────┼───────────────┬─────────────┐
      │              │             │               │             │
      ▼              ▼             ▼               ▼             ▼
 MongoDB Atlas   Socket.IO     Groq AI      Cloudinary     Nodemailer
      │              │             │               │             │
      ▼              ▼             ▼               ▼             ▼
Customer DB     Live Chat     Stitch AI      Portfolio      Email Alerts
Tailor DB                     Stitch Pro
Messages
Orders

                   Tesseract OCR
                          │
                          ▼
              AES-256 Encrypted Aadhaar
```

---
# 🤖 AI Assistants
TailorConnect integrates **two specialized AI assistants** powered by **Groq LLaMA 3.3 (70B)**.
---
## ✂ Stitch — Customer Assistant
Designed to help customers throughout their tailoring journey.
### Capabilities
- Recommend nearby tailors
- Suggest tailors based on specialization
- Fabric recommendations
- Styling guidance
- Measurement assistance
- Delivery timeline guidance
- Platform support
Unlike traditional chatbots, Stitch performs Retrieval-Augmented Generation by injecting live tailor records fetched directly from MongoDB before generating recommendations.
This ensures AI responses always use real platform data instead of hallucinated tailor information.
---
## 🧵 Stitch Pro — Tailor Assistant
An AI business assistant designed specifically for registered tailors.
### Capabilities
- Pricing suggestions
- Customer handling advice
- Fabric recommendations
- Order management guidance
- Business growth tips
- Tailoring best practices
Both assistants maintain session-based conversation memory enabling natural multi-turn interactions.
---
# 🔐 Security Architecture
```text
                Signup
                   │
             bcrypt Hashing
                   │
                 MongoDB
──────────────────────────────────────────────
                 Login
                   │
           Password Verification
                   │
              JWT Generation
                   │
          Protected API Routes
                   │
        verifyToken Middleware
                   │
          Authorized Resources
──────────────────────────────────────────────
           Aadhaar Upload
                   │
         OCR using Tesseract.js
                   │
         AES-256 Encryption
                   │
           MongoDB Storage
──────────────────────────────────────────────
Client Request
      │
Helmet Headers
      │
Rate Limiter
      │
JWT Validation
      │
Controller
      │
MongoDB
```
## 🛡 Security Features
- JWT Authentication
- bcrypt Password Hashing
- AES-256 Aadhaar Encryption
- Helmet Security Headers
- Role-based Authorization
- Tiered API Rate Limiting
- CORS Protection
- Environment Variable Configuration
- Secure Cloudinary Storage
- Protected API Middleware
- Session-aware Authentication
- Browser Back Navigation Protection
---
# ⚡ Performance Validation
The application was stress-tested using **K6** to evaluate API stability, authentication robustness, and real-time communication under concurrent traffic.
```text
Testing Tool      : K6
Virtual Users     : 100
Duration          : 30 Seconds
HTTP Requests     : 3000+
Socket Clients    : 100
Messages          : 10,000+
HTTP Success      : 100%
JWT Validation    : 401 Verified
Rate Limiting     : 429 Verified
Request Failure   : 0%
```
The testing validated stable API behavior, correct JWT protection, successful rate limiting, and reliable WebSocket communication under concurrent load.
---
# 📸 Application Screenshots

## Landing Page

<p align="center">
<img src="" width="900">
</p>

---

## Customer Dashboard

<p align="center">
<img src="C:\Users\hp\OneDrive\Desktop\TailorConnect\frontend\src\assets\screenshots\image.png" width="900">
</p>
---
## Tailor Dashboard
<p align="center">
<img src="assets/screenshots/tailor-dashboard.png" width="900">
</p>

---

## AI Chatbot

<p align="center">
<img src="assets/screenshots/chatbot.png" width="900">
</p>

---

## Real-Time Chat

<p align="center">
<img src="assets/screenshots/realtime-chat.png" width="900">
</p>

---

## Portfolio

<p align="center">
<img src="assets/screenshots/portfolio.png" width="900">
</p>

---

## Order Tracking

<p align="center">
<img src="assets/screenshots/orders.png" width="900">
</p>

---

## Aadhaar OCR

<p align="center">
<img src="assets/screenshots/aadhaar.png" width="900">
</p>
---
# 🛠 Technology Stack
## Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Axios
- React Router DOM
- Socket.IO Client
---
## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Socket.IO
- Helmet.js
- express-rate-limit
- MVC Architecture
---
## Database
- MongoDB Atlas
- Mongoose
---
## AI & Cloud Services
- Groq LLaMA 3.3 (70B)
- Tesseract.js OCR
- Cloudinary
- Nodemailer
- India Post API
---
## Testing & Deployment
- K6
- Postman
- Git
- GitHub
- Vercel
- Render
---
# 📂 Project Structure
```text
TailorConnect
│
├── frontend
│   │
│   ├── src
│   │   │
│   │   ├── api
│   │   ├── auth
│   │   ├── components
│   │   ├── Customer
│   │   ├── Tailor
│   │   ├── pages
│   │   ├── context
│   │   └── assets
│   │
│   ├── public
│   └── package.json
│
├── backend
│   │
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routers
│   ├── uploads
│   ├── loadtest.js
│   ├── websocket-test.js
│   ├── server.js
│   └── package.json
│
└── README.md
```
# ⚙ Local Setup
## 1️⃣ Clone Repository
```bash
git clone https://github.com/palak-19-rgb/TailorConnect.git
cd TailorConnect
```
## 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
node server.js
```
Backend runs on
```
http://localhost:1000
## 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on
```
http://localhost:5173
```

---
# 🔑 Environment Variables
## Backend `.env`
```env
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
AADHAAR_SECRET_KEY=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
```
---
## Frontend `.env`
```env
VITE_API_URL=https://tailorconnect-backend.onrender.com
```
---
# 🔄 Request Flow
```text
React Frontend
        │
Axios + JWT
        │
        ▼
Express Router
        │
verifyToken Middleware
        │
Controller
        │
MongoDB Atlas
        │
Response
        │
React UI
```
---
# 💬 Real-Time Messaging Flow
```text
Customer
      │
Socket.IO
      │
Express Server
      │
MongoDB Message Storage
      │
Socket Room Broadcast
      │
Tailor
```
---
# 🤖 AI Recommendation Flow
```text
Customer Question
        │
Groq Chatbot Controller
        │
Retrieve Tailors
(MongoDB)
        │
Inject Context
(RAG)
        │
Groq LLaMA 3.3
        │
Tailor Recommendation
```
---
# 🔍 Aadhaar Verification Pipeline
```text
Upload Aadhaar
        │
Tesseract OCR
        │
Extract Details
        │
AES-256 Encryption
        │
MongoDB Storage
        │
Profile Verification
```
---

# 🌍 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| AI | Groq |
| OCR | Tesseract.js |
| Media Storage | Cloudinary |
| Email Service | Nodemailer |

---

# 🧪 API & Load Testing
The platform was validated using **Postman** and **K6**.
### REST API Testing
- Customer Authentication
- Tailor Authentication
- JWT Authorization
- Portfolio APIs
- Order APIs
- Chat APIs
- Aadhaar Verification APIs
- AI Chatbot APIs

---
### K6 Stress Testing
```
Concurrent Virtual Users
100
Duration
30 Seconds
HTTP Requests
3000+
WebSocket Clients
100
Messages
10,000+
Failure Rate
0%
JWT Validation
401 Verified
Rate Limiting
429 Verified
```
---

# 🚀 Future Improvements

- CI/CD pipeline using GitHub Actions
- Docker containerization
- Kubernetes deployment
- Redis caching
- Push Notifications
- Elasticsearch-powered tailor search
- AI-powered outfit recommendation engine
- AI-based measurement extraction from body images
- Recommendation ranking using user preferences
- Payment Gateway Integration
- Admin Dashboard & Analytics
- Multi-language Support
---
# ⭐ What Makes TailorConnect Different?
Unlike a traditional CRUD MERN application, TailorConnect combines multiple production-grade engineering concepts into a single platform.
AI-powered tailor recommendations using Retrieval-Augmented Generation (RAG)
Dual AI assistants powered by Groq LLaMA 3.3
Secure JWT authentication with bcrypt hashing
Aadhaar OCR verification with encrypted storage
Real-time Socket.IO communication
Cloud-native media management
Role-based dashboards
Production security using Helmet & Rate Limiting
Concurrent load testing with K6
Modular MVC backend architecture
Fully deployed cloud application
---
# 👩‍💻 Author
## Palak Chugh
**LinkedIn**
https://www.linkedin.com/in/palakchugh/
**GitHub**
https://github.com/palak-19-rgb
**LeetCode**
https://leetcode.com/u/palakkkkk/
---

# ⭐ Support
If you found this project interesting, consider giving it a **⭐ Star** on GitHub.
It helps others discover the project and motivates future improvements.
---
<p align="center">

### ✂️ Built with React, Node.js, Express, MongoDB, Socket.IO, Groq AI and lots of ☕.
**Modernizing local tailoring through AI, secure cloud-native architecture, and real-time communication.**
</p>