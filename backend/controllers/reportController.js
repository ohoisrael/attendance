const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, departmentId } = req.query;
    
    const attendance = await Attendance.findAll(
      startDate || '1900-01-01', 
      endDate || '2100-12-31',
      departmentId
    );
    
    const stats = await Attendance.getStats(
      startDate || '1900-01-01', 
      endDate || '2100-12-31'
    );
    
    res.json({
      attendance,
      stats
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [departments] = await db.query(`
      SELECT d.id, d.name, 
        COUNT(DISTINCT e.id) as total_employees,
        COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.employee_id END) as present,
        COUNT(DISTINCT CASE WHEN a.status = 'late' THEN a.employee_id END) as late,
        COUNT(DISTINCT CASE WHEN a.status = 'absent' THEN a.employee_id END) as absent
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      LEFT JOIN attendance a ON e.id = a.employee_id AND a.date BETWEEN ? AND ?
      GROUP BY d.id, d.name
    `, [startDate || '1900-01-01', endDate || '2100-12-31']);
    
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

const getEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const attendance = await Attendance.findByEmployee(
      employeeId, 
      startDate || '1900-01-01', 
      endDate || '2100-12-31'
    );
    
    res.json({
      employee,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendanceReport,
  getDepartmentReport,
  getEmployeeReport
};