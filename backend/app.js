const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const unitRoutes = require('./routes/unitRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');
const attendanceSyncService = require('./services/attendanceSyncService');
const attendanceSync = new attendanceSyncService();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handler
app.use(errorHandler);

// Start attendance sync service
attendanceSync.start();

// shutdown attendance sync service
process.on('SIGINT', () => {
  attendanceSync.stop();
  process.exit(0);
});

module.exports = app;