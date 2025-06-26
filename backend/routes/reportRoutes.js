const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/attendance', auth(), reportController.getAttendanceReport);
router.get('/departments', auth(), reportController.getDepartmentReport);
router.get('/employee/:employeeId', auth(), reportController.getEmployeeReport);

module.exports = router;