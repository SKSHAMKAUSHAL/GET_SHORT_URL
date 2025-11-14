# 🔗 GET_SHORT_URL - Modern URL Shortener

A full-stack, production-ready URL shortening service with user authentication, real-time analytics, Redis caching, and beautiful modern UI. Built with the MERN stack and deployed on Vercel.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![Vercel](https://img.shields.io/badge/deployed-vercel-black.svg)

## ✨ Key Features

### 🎨 Modern UI/UX
- Beautiful gradient design with glass morphism effects
- Responsive mobile-first layout
- Smooth animations and transitions
- Lucide React icons throughout

### 🔐 Core Features
- User authentication with JWT
- URL shortening with analytics
- QR code generation
- Redis caching for performance
- Real-time click tracking
- Bot protection with reCAPTCHA

### 📊 Analytics
- Device & browser tracking
- Click timeline visualization
- Geographic data capture
- Interactive Chart.js graphs

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/SKSHAMKAUSHAL/GET_SHORT_URL.git
cd GET_SHORT_URL

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Edit .env with API URL

# Run development servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### URL Management (Authenticated)
- `POST /api/shorten` - Create short URL
- `GET /api/user/urls` - Get user's URLs
- `GET /api/user/urls/:shortId` - Get URL details
- `GET /api/analytics/:shortId` - Get analytics
- `PUT /api/:shortId` - Update URL
- `PUT /api/:shortId/toggle-status` - Toggle active status
- `DELETE /api/:shortId` - Delete URL

### Public
- `GET /s/:shortId` - Redirect to original URL

## 🔧 Tech Stack

**Backend:** Node.js, Express, MongoDB, Redis, JWT, Winston  
**Frontend:** React 19, Tailwind CSS, Chart.js, Lucide Icons  
**Deployment:** Vercel

## 📦 Environment Variables

**Backend (.env):**
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
RECAPTCHA_SECRET=your_recaptcha_secret
PORT=5000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=/api
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key
```

## 🚀 Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

Configure environment variables in Vercel dashboard.

## 🐛 Fixed Issues

✅ **Vercel 404 Errors** - Implemented proper routing with `/api` prefix  
✅ **Modern UI/UX** - Complete redesign with gradients and glass morphism  
✅ **Code Organization** - Clean, maintainable code structure

## 👨‍💻 Author

**SKSHAM KAUSHAL**  
GitHub: [@SKSHAMKAUSHAL](https://github.com/SKSHAMKAUSHAL)

## 📝 License

ISC License

---

⭐ Star this repository if you find it helpful!

Built with ❤️ using the MERN Stack | Deployed on Vercel ▲
