const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');

router.post('/', auth(), attendanceController.recordAttendance);
router.get('/employee/:employeeId', auth(), attendanceController.getEmployeeAttendance);
router.get('/', auth(), attendanceController.getAllAttendance);
router.get('/stats', auth(), attendanceController.getAttendanceStats);

module.exports = router;