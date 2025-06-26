import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';

export const validateUser = [
  body('username').notEmpty().trim(),
  body('password').isLength({ min: 6 }),
  body('email').isEmail(),
  body('role').isIn(['admin', 'hr', 'employee'])
];

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, empNo, username, email, role, fullName, department, unit, position, activation FROM users');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createUser = async (req, res) => {
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