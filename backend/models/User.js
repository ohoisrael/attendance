const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, password, role, email }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, email]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;