const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');

router.post('/', auth(), attendanceController.recordAttendance);
router.get('/employee/:employeeId', auth(), attendanceController.getEmployeeAttendance);
router.get('/', auth(), attendanceController.getAllAttendance);
router.get('/stats', auth(), attendanceController.getAttendanceStats);
router.get('/logs', attendanceController.getAttendanceLogs);
router.get('/realtime', auth(), async (req, res) => {
  try {
    const attendance = await Attendance.findRecent(10); // Last 10 records
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

module.exports = router;