const db = require('../config/db');

class Department {
  static async create({ name, workHours, room, description }) {
    const [result] = await db.query(
      'INSERT INTO departments (name, work_hours, room, description) VALUES (?, ?, ?, ?)',
      [name, workHours, room, description]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM departments');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM departments WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { name, workHours, room, description }) {
    await db.query(
      'UPDATE departments SET name = ?, work_hours = ?, room = ?, description = ? WHERE id = ?',
      [name, workHours, room, description, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM departments WHERE id = ?', [id]);
  }
}

module.exports = Department;