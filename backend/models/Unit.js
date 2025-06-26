const db = require('../config/db');

class Unit {
  static async create({ name, departmentId, headOfUnit, description }) {
    const [result] = await db.query(
      'INSERT INTO units (name, department_id, head_of_unit, description) VALUES (?, ?, ?, ?)',
      [name, departmentId, headOfUnit, description]
    );
    return result.insertId;
  }

  static async findByDepartment(departmentId) {
    const [rows] = await db.query('SELECT * FROM units WHERE department_id = ?', [departmentId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM units WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { name, departmentId, headOfUnit, description }) {
    await db.query(
      'UPDATE units SET name = ?, department_id = ?, head_of_unit = ?, description = ? WHERE id = ?',
      [name, departmentId, headOfUnit, description, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM units WHERE id = ?', [id]);
  }

  static async findAll() {
    const [rows] = await db.query(`
      SELECT u.*, d.name as department_name 
      FROM units u
      JOIN departments d ON u.department_id = d.id
    `);
    return rows;
  }
}

module.exports = Unit;