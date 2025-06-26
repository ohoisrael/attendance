const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const recordAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, clockIn, clockOut, status, notes } = req.body;
    
    const existingRecord = await Attendance.findByEmployeeAndDate(employeeId, date);
    
    if (existingRecord) {
      await Attendance.update(existingRecord.id, {
        clockIn: clockIn || existingRecord.clock_in,
        clockOut: clockOut || existingRecord.clock_out,
        status: status || existingRecord.status,
        notes: notes || existingRecord.notes
      });
    } else {
      await Attendance.create({
        employeeId,
        date,
        clockIn,
        clockOut,
        status,
        notes
      });
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

module.exports = {
  recordAttendance,
  getEmployeeAttendance,
  getAllAttendance,
  getAttendanceStats
};