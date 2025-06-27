const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { fetchLogs } = require('../utils/zktecoService');
const { sendAttendanceNotification } = require('../utils/emailService');

const recordAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, clockIn, clockOut, status, notes } = req.body;
    
    const existingRecord = await Attendance.findByEmployeeAndDate(employeeId, date);
    
    // Get employee details for email notification
    const employee = await Employee.findById(employeeId);
    
    if (existingRecord) {
      // Update existing record
      const updatedRecord = await Attendance.update(existingRecord.id, {
        clockIn: clockIn || existingRecord.clock_in,
        clockOut: clockOut || existingRecord.clock_out,
        status: status || existingRecord.status,
        notes: notes || existingRecord.notes
      });
      
      // Send email notification for clock out if it's new
      if (clockOut && !existingRecord.clock_out && employee) {
        await sendAttendanceNotification(
          employee.email,
          employee.fullName,
          'clockOut',
          clockOut,
          'Main Office'
        );
      }
    } else {
      // Create new record
      const newRecord = await Attendance.create({
        employeeId,
        date,
        clockIn,
        clockOut,
        status,
        notes
      });
      
      // Send email notification for clock in
      if (clockIn && employee) {
        await sendAttendanceNotification(
          employee.email,
          employee.fullName,
          'clockIn',
          clockIn,
          'Main Office'
        );
      }
    }
    
    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    next(error);
  }
};

const getEmployeeAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    const attendance = await Attendance.findByEmployee(
      employeeId, 
      startDate || '1900-01-01', 
      endDate || '2100-12-31'
    );
    
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate, departmentId } = req.query;
    
    const attendance = await Attendance.findAll(
      startDate || '1900-01-01', 
      endDate || '2100-12-31',
      departmentId
    );
    
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

const getAttendanceStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await Attendance.getStats(
      startDate || '1900-01-01', 
      endDate || '2100-12-31'
    );
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getAttendanceLogs = async (req, res) => {
  try {
    const logs = await fetchLogs();
    
    // Process each log and send email notifications
    for (const log of logs) {
      // Find employee by user ID from device
      const employee = await Employee.findByUserId(log.userId);
      
      if (employee) {
        // Determine if this is a clock in or clock out based on time
        const currentTime = new Date();
        const logTime = new Date(log.timestamp);
        const isClockIn = logTime.getHours() < 12; // Assume morning is clock in
        
        // Save to database
        await Attendance.create({
          employeeId: employee.id,
          date: logTime.toISOString().split('T')[0],
          clockIn: isClockIn ? logTime : null,
          clockOut: !isClockIn ? logTime : null,
        });
        
        // Send email notification
        await sendAttendanceNotification(
          employee.email,
          employee.fullName,
          isClockIn ? 'clockIn' : 'clockOut',
          logTime,
          'Biometric Device'
        );
      }
    }
    
    res.json({ success: true, logs, message: 'Attendance logs processed and emails sent' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

module.exports = {
  recordAttendance,
  getEmployeeAttendance,
  getAllAttendance,
  getAttendanceStats,
  getAttendanceLogs
};