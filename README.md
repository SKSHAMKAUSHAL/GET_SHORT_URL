# 🔗 GET_SHORT_URL

A full-stack URL shortening service with user authentication, analytics, and Redis caching. Built with the MERN stack.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)

## ✨ Features

- 🔐 **User Authentication** - JWT-based authentication with bcrypt
- 🔗 **URL Shortening** - Generate unique short URLs
- 📊 **Analytics Dashboard** - Track clicks, devices, and browsers
- ⚡ **Redis Caching** - High-performance caching
- 🎯 **URL Management** - Pause/resume, edit, and delete URLs
- 🤖 **Bot Protection** - Google reCAPTCHA v2 integration
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🎨 **QR Code Generation** - Generate QR codes for URLs
- 🔒 **Rate Limiting** - 100 requests per 15 minutes

## 🏗️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Redis, JWT, bcryptjs, Winston  
**Frontend:** React 19, React Router, Tailwind CSS, Chart.js, Axios  
**Deployment:** Vercel

## 📁 Project Structure

```
├── backend/          # Node.js/Express API
│   ├── config/       # Database & Redis setup
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth & validation
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   └── utils/        # Logger utilities
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   └── context/     # Auth context
│   └── public/
└── vercel.json       # Deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB Atlas account
- Redis Cloud account
- Google reCAPTCHA v2 keys

### Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/SKSHAMKAUSHAL/GET_SHORT_URL.git
   cd GET_SHORT_URL
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Variables**
   
   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   REDIS_URL=redis://user:pass@host:port
   RECAPTCHA_SECRET=your_recaptcha_secret
   PORT=5000
   ```

3. **Run Locally**
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev
   
   # Frontend (Terminal 2)
   cd frontend && npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### URL Management (Requires Auth)
- `POST /shorten` - Create short URL
- `GET /urls` - Get user's URLs
- `GET /:shortId` - Get URL details
- `GET /analytics/:shortId` - Get URL analytics
- `PUT /:shortId` - Update URL
- `PATCH /:shortId/status` - Toggle URL active status
- `DELETE /:shortId` - Delete URL

### Public
- `GET /:shortId` - Redirect to original URL (tracks analytics)

## 🚀 Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - `MONGO_URI`
   - `JWT_SECRET`
   - `REDIS_URL`
   - `RECAPTCHA_SECRET`

## 👨‍💻 Author

**SKSHAM KAUSHAL**  
GitHub: [@SKSHAMKAUSHAL](https://github.com/SKSHAMKAUSHAL)

## 📝 License

ISC License

---

⭐ Star this repo if you find it useful!
