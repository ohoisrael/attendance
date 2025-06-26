const db = require('../config/db');

class Employee {
  static async create(employeeData) {
    const [result] = await db.query(
      `INSERT INTO employees (
        emp_no, user_id, first_name, last_name, email, mobile, telephone, gender, dob,
        department_id, unit_id, position, highest_qualification, address, country,
        start_date, marital_status, children_no, bank_name, account_no, bio, fingerprint_id, profile_picture
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeData.empNo, employeeData.userId, employeeData.firstName, employeeData.lastName,
        employeeData.email, employeeData.mobile, employeeData.telephone, employeeData.gender,
        employeeData.dob, employeeData.departmentId, employeeData.unitId, employeeData.position,
        employeeData.highestQualification, employeeData.address, employeeData.country,
        employeeData.startDate, employeeData.maritalStatus, employeeData.childrenNo,
        employeeData.bankName, employeeData.accountNo, employeeData.bio, 
        employeeData.fingerprintId, employeeData.profilePicture
      ]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query(`
      SELECT e.*, d.name as department_name, u.name as unit_name, u.department_id as unit_department_id
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN units u ON e.unit_id = u.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT e.*, d.name as department_name, u.name as unit_name, u.department_id as unit_department_id
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN units u ON e.unit_id = u.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM employees WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async update(id, employeeData) {
    await db.query(
      `UPDATE employees SET 
        emp_no = ?, first_name = ?, last_name = ?, email = ?, mobile = ?, telephone = ?,
        gender = ?, dob = ?, department_id = ?, unit_id = ?, position = ?,
        highest_qualification = ?, address = ?, country = ?, start_date = ?,
        marital_status = ?, children_no = ?, bank_name = ?, account_no = ?,
        bio = ?, fingerprint_id = ?, profile_picture = ?, is_active = ?
      WHERE id = ?`,
      [
        employeeData.empNo, employeeData.firstName, employeeData.lastName,
        employeeData.email, employeeData.mobile, employeeData.telephone,
        employeeData.gender, employeeData.dob, employeeData.departmentId,
        employeeData.unitId, employeeData.position, employeeData.highestQualification,
        employeeData.address, employeeData.country, employeeData.startDate,
        employeeData.maritalStatus, employeeData.childrenNo, employeeData.bankName,
        employeeData.accountNo, employeeData.bio, employeeData.fingerprintId,
        employeeData.profilePicture, employeeData.isActive, id
      ]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM employees WHERE id = ?', [id]);
  }

  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM employees');
    return rows[0].count;
  }

  static async findByDepartment(departmentId) {
    const [rows] = await db.query('SELECT * FROM employees WHERE department_id = ?', [departmentId]);
    return rows;
  }
}

module.exports = Employee;