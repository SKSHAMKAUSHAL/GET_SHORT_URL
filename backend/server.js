const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const RateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();
connectDB();

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  logger.info('Incoming request', { method: req.method, url: req.url, headers: req.headers });
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use('/auth', authRoutes);
app.use('/', urlRoutes);

// Log unhandled routes
app.use((req, res, next) => {
  logger.warn('Unhandled route', { method: req.method, url: req.url });
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));