# 🔗 GET_SHORT_URL - Advanced URL Shortener

A full-stack, production-ready URL shortening service with user authentication, analytics, Redis caching, and real-time monitoring. Built with the MERN stack and designed for scalability and performance.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- 🔗 **URL Shortening** - Generate unique short URLs using shortid
- 📊 **Analytics Dashboard** - Track clicks, devices, browsers, and user agents
- ⚡ **Redis Caching** - High-performance caching for fast redirects
- 🎯 **URL Management** - Pause/resume, edit, and delete shortened URLs
- 🤖 **Bot Protection** - Google reCAPTCHA v2 integration
- 📱 **Responsive Design** - Mobile-first UI built with Tailwind CSS

### Advanced Features
- 📈 **Real-time Analytics** - Chart.js visualizations for click statistics
- 🔒 **Rate Limiting** - Protection against abuse (100 requests per 15 minutes)
- 🛡️ **Security** - Helmet.js for HTTP headers, CORS support
- 📝 **Logging** - Winston logger with detailed request/response tracking
- 🎨 **QR Code Generation** - Generate QR codes for shortened URLs
- 🌐 **IP Tracking** - Geographic and device information capture
- ♻️ **Cache Invalidation** - Automatic cache clearing on URL updates

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis Cloud
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator + validator.js
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston + Morgan
- **Bot Protection**: Google reCAPTCHA Enterprise

### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS with custom forms
- **Charts**: Chart.js + react-chartjs-2
- **QR Codes**: qrcode.react
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Loading States**: react-spinners

### DevOps
- **Deployment**: Vercel (configured)
- **Development**: Nodemon for hot reload
- **Version Control**: Git

## 📁 Project Structure

```
Url-shortener-main/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis client setup
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── urlController.js   # URL operations & analytics
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── validate.js        # Input validation
│   ├── models/
│   │   ├── urlModel.js        # URL schema with clicks tracking
│   │   └── userModel.js       # User schema with password hashing
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── urlRoutes.js       # URL management endpoints
│   ├── utils/
│   │   └── logger.js          # Winston logger configuration
│   ├── flushRedis.js          # Redis cleanup utility
│   ├── server.js              # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsChart.js  # Chart.js visualizations
│   │   │   ├── Dashboard.js       # Main dashboard
│   │   │   ├── Login.js           # Login form
│   │   │   ├── Register.js        # Registration form
│   │   │   ├── PausedUrl.js       # Paused URL page
│   │   │   ├── UrlDetails.js      # Individual URL analytics
│   │   │   └── UrlShortener.js    # URL creation form
│   │   ├── context/
│   │   │   └── AuthContext.js     # Global auth state
│   │   ├── App.js                 # Root component & routing
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Global styles
│   ├── tailwind.config.js
│   └── package.json
│
├── vercel.json                # Vercel deployment config
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account (MongoDB Atlas recommended)
- Redis Cloud account
- Google reCAPTCHA v2 keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SKSHAMKAUSHAL/GET_SHORT_URL.git
   cd GET_SHORT_URL
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key

# Redis Configuration
REDIS_URL=redis://default:password@host:port

# Google reCAPTCHA
RECAPTCHA_SECRET=your_recaptcha_secret_key
```

**Important**: Never commit your `.env` file to version control!

### Running the Application

#### Development Mode

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
```
React app will start on `http://localhost:3000`

#### Production Build

**Frontend**:
```bash
cd frontend
npm run build
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### URL Management Endpoints

All URL endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Shorten URL
```http
POST /shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url",
  "recaptchaToken": "recaptcha_token_from_frontend"
}
```

#### Get User's URLs
```http
GET /urls
```

#### Get URL Details
```http
GET /:shortId
```

#### Get Analytics
```http
GET /analytics/:shortId
```

#### Update URL
```http
PUT /:shortId
Content-Type: application/json

{
  "originalUrl": "https://newurl.com"
}
```

#### Toggle URL Status
```http
PATCH /:shortId/status
Content-Type: application/json

{
  "active": true  // or false to pause
}
```

#### Delete URL
```http
DELETE /:shortId
```

#### Clear Cache
```http
DELETE /cache/:cacheKey
```

### Redirect Endpoint

#### Redirect to Original URL
```http
GET /:shortId
```
This endpoint does not require authentication and redirects to the original URL while tracking analytics.

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds of 12
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: express-validator for all inputs
- **URL Validation**: Protocol and format validation
- **Helmet.js**: Security headers for Express
- **CORS**: Configured cross-origin resource sharing
- **reCAPTCHA**: Bot protection on URL creation
- **Environment Variables**: Sensitive data protection

## 📊 Analytics Tracked

For each shortened URL click, the system tracks:
- 🕐 Timestamp
- 🌐 IP Address
- 🖥️ Device Type (desktop, mobile, tablet)
- 🌍 Browser Information
- 📱 User Agent String

## 🎨 Frontend Features

- **Protected Routes**: Authentication-based routing
- **Context API**: Global state management for authentication
- **Toast Notifications**: User-friendly feedback messages
- **Loading States**: Spinner components for async operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Chart Visualizations**: Interactive analytics charts
- **QR Code Generation**: Instant QR codes for sharing

## 🐛 Troubleshooting

### Redis Connection Issues
```bash
# Test Redis connection
cd backend
node -e "require('./config/redis.js')"
```

### MongoDB Connection Issues
- Verify your MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 🚀 Deployment

### Vercel Deployment

The project includes a `vercel.json` configuration file for easy deployment:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:
- `MONGO_URI`
- `JWT_SECRET`
- `REDIS_URL`
- `RECAPTCHA_SECRET`
- `PORT` (optional, defaults to 5000)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**SKHAM KAUSHAL**
- GitHub: [@SKSHAMKAUSHAL](https://github.com/SKSHAMKAUSHAL)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Redis Cloud for caching infrastructure
- Vercel for hosting platform
- Google reCAPTCHA for bot protection
- All open-source contributors

## 📞 Support

If you encounter any issues or have questions:
- 📧 Open an issue on GitHub
- 💬 Check existing issues for solutions
- 📖 Review the documentation above

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ using the MERN Stack
