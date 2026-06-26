# ✂️ TailorConnect

A full-stack platform connecting customers with local tailors through real-time chat, AI-powered recommendations, secure identity verification, and end-to-end order management.

**Live Demo:** [Frontend](https://tailorconnect-gilt.vercel.app) • [Backend](https://tailorconnect-backend.onrender.com)

---

## 🚀 Features

- **JWT Auth** — bcrypt hashing, role-based protected routes (Customer / Tailor)
- **Aadhaar Verification** — Tesseract.js OCR auto-extracts ID details, AES-256-CBC encrypted storage
- **AI Chatbots** — "Stitch" (customer tailor recommender) + "Stitch Pro" (tailor business assistant) via Groq LLaMA 3.3-70b with live DB context
- **Real-Time Chat** — Socket.IO room-based messaging with persistent MongoDB history
- **Order Management** — 5-stage tracking (Pending → Cutting → Stitching → Ready → Delivered) with automated Nodemailer email notifications
- **Portfolio System** — Cloudinary image upload, category tagging, featured/signature marking
- **Profile Lock** — Form disabled post-save, edit mode toggle, 10-min idle auto-logout
- **Security** — Helmet.js, CORS, tiered rate limiting (100 req/15min general, 10 req/15min auth)
- **Load Tested** — K6: 100 concurrent VUs, 3000+ requests, JWT & rate limiting verified

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Services |
|---|---|---|---|
| React.js (TypeScript) | Node.js + Express.js | MongoDB Atlas | Cloudinary |
| Tailwind CSS | Socket.IO | Mongoose | Groq AI |
| Framer Motion + GSAP | JWT + bcrypt | | Nodemailer |
| | Helmet + Rate Limit | | Tesseract.js |

---

## 📁 Project Structure

```
TailorConnect/
├── frontend/         # React + TypeScript
│   ├── src/
│   │   ├── auth/     # Login, Signup, Hero
│   │   ├── Customer/ # Dashboard, Profile, Orders, Chat
│   │   ├── Tailor/   # Dashboard, Profile, Portfolio, Customers
│   │   └── api/      # Axios instance with JWT interceptor
├── backend/
│   ├── controllers/  # Customer, Tailor, TailorCustomer, Chatbot
│   ├── models/       # Mongoose schemas
│   ├── routers/      # Express routes
│   ├── middleware/   # JWT verifyToken
│   └── config/       # DB, Cloudinary, Mailer, AI
```

---

## ⚙️ Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your keys
node server.js

# Frontend
cd frontend
npm install
npm run dev
```

### Environment Variables (backend)
```
MONGO_URI=
JWT_SECRET=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
AADHAAR_SECRET_KEY=
GROQ_API_KEY=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
```

### Environment Variables (frontend)
```
VITE_API_URL=https://your-render-url.onrender.com
```

---

## 🧪 Load Testing

```bash
# Install k6
winget install k6

# Run
cd backend
k6 run loadtest.js
```

**Results:** 100 VUs • 30s • 3000+ requests • JWT 401 ✅ • Rate limiting ✅

---

## 📦 Deployment

- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas
- **Media** → Cloudinary CDN

---

*Crafted with precision ✂️*