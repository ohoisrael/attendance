const db = require('../config/db');

class Attendance {
  static async create(attendanceData) {
    const [result] = await db.query(
      `INSERT INTO attendance (
        employee_id, date, clock_in, clock_out, hours_worked, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        attendanceData.employeeId, attendanceData.date, attendanceData.clockIn,
        attendanceData.clockOut, attendanceData.hoursWorked, attendanceData.status,
        attendanceData.notes
      ]
    );
    return result.insertId;
  }

  static async findByEmployeeAndDate(employeeId, date) {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
      [employeeId, date]
    );
    return rows[0];
  }

  static async update(id, attendanceData) {
    await db.query(
      `UPDATE attendance SET 
        clock_in = ?, clock_out = ?, hours_worked = ?, status = ?, notes = ?
      WHERE id = ?`,
      [
        attendanceData.clockIn, attendanceData.clockOut, attendanceData.hoursWorked,
        attendanceData.status, attendanceData.notes, id
      ]
    );
  }

  static async findByEmployee(employeeId, startDate, endDate) {
    const [rows] = await db.query(
      `SELECT * FROM attendance 
       WHERE employee_id = ? 
       AND date BETWEEN ? AND ?
       ORDER BY date DESC`,
      [employeeId, startDate, endDate]
    );
    return rows;
  }

  static async findAll(startDate, endDate, departmentId) {
    let query = `
      SELECT a.*, e.first_name, e.last_name, e.emp_no, d.name as department_name, u.name as unit_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      LEFT JOIN units u ON e.unit_id = u.id
      WHERE a.date BETWEEN ? AND ?
    `;
    
    const params = [startDate, endDate];
    
    if (departmentId) {
      query += ' AND e.department_id = ?';
      params.push(departmentId);
    }
    
    query += ' ORDER BY a.date DESC, e.first_name ASC';
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getStats(startDate, endDate) {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'early_departure' THEN 1 ELSE 0 END) as early_departure
      FROM attendance
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);
    
    return rows[0];
  }
}

module.exports = Attendance;