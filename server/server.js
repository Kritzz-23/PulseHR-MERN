const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests dispatched from this IP address, please try again after 15 minutes'
});
app.use('/api', limiter);

// Mount API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Root Healthcheck & Documentation route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'PulseHR — Enterprise HRMS & Employee Management API',
    version: '1.0.0',
    documentation: 'https://github.com/Kritzz-23/PulseHR-MERN',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/employees',
      'GET /api/leaves',
      'POST /api/leaves',
      'POST /api/attendance/clock-in',
      'GET /api/attendance/today',
      'GET /api/tasks',
      'GET /api/analytics/dashboard'
    ]
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`PulseHR Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
