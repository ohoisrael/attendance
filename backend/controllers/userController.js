const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

exports.validateUser = [
  body('username').notEmpty().trim(),
  body('password').isLength({ min: 6 }),
  body('email').isEmail(),
  body('role').isIn(['admin', 'hr', 'employee'])
];

exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, empNo, username, email, role, fullName, department, unit, position, activation FROM users');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      empNo, username, password, email, role, firstName, lastName,
      gender, dob, mobile, telephone, bankName, accountNo,
      highestQualification, department, unit, position,
      address, country, startDate, maritalStatus, childrenNo,
      bio, fingerprint
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;

    const [result] = await pool.query(
      `INSERT INTO users (
        empNo, username, password, email, role, firstName, lastName, fullName,
        gender, dob, mobile, telephone, bankName, accountNo, highestQualification,
        department, unit, position, address, country, startDate, maritalStatus,
        childrenNo, bio, fingerprint, activation, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        empNo, username, hashedPassword, email, role, firstName, lastName, fullName,
        gender, dob, mobile, telephone, bankName, accountNo, highestQualification,
        department, unit, position, address, country, startDate, maritalStatus,
        childrenNo, bio, fingerprint, true
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'User created successfully' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Find user
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    next(error);
  }
};