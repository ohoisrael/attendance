const db = require('../config/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [adminResult] = await db.query(
      'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'admin', 'admin@hospital.com']
    );
    
    // Create departments
    const [emergencyDept] = await db.query(
      'INSERT INTO departments (name, work_hours, room, description) VALUES (?, ?, ?, ?)',
      ['Emergency Department', '24/7', 'Ground Floor - East Wing', 'Handles emergency medical cases and critical care']
    );
    
    const [surgeryDept] = await db.query(
      'INSERT INTO departments (name, work_hours, room, description) VALUES (?, ?, ?, ?)',
      ['Surgery Department', '6:00 AM - 10:00 PM', '3rd Floor - Central Wing', 'Surgical procedures and operating theaters']
    );
    
    const [adminDept] = await db.query(
      'INSERT INTO departments (name, work_hours, room, description) VALUES (?, ?, ?, ?)',
      ['Administration', '8:00 AM - 5:00 PM', '1st Floor - West Wing', 'Hospital administration and management']
    );
    
    // Create units
    await db.query(
      'INSERT INTO units (name, department_id, head_of_unit, description) VALUES ?',
      [
        [
          ['Emergency Room', emergencyDept.insertId, 'Dr. Smith', 'Main emergency treatment area'],
          ['Trauma Unit', emergencyDept.insertId, 'Dr. Johnson', 'Specialized trauma care'],
          ['Operating Theater 1', surgeryDept.insertId, 'Dr. Williams', 'General surgery operations'],
          ['Human Resources', adminDept.insertId, 'HR Manager', 'Staff management and recruitment'],
          ['IT Management', adminDept.insertId, 'IT Director', 'Technology and systems management']
        ]
      ]
    );
    
    // Create admin employee
    const [adminEmp] = await db.query(
      `INSERT INTO employees (
        emp_no, user_id, first_name, last_name, email, mobile, gender, dob,
        department_id, position, address, country, start_date, marital_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'EMP001', adminResult.insertId, 'Vincent', 'Ayorinde', 'admin@hospital.com', 
        '0240652816', 'male', '1985-11-01', adminDept.insertId, 'System Administrator',
        'P.O.Box Tema 9890', 'Ghana', '2015-03-04', 'single'
      ]
    );
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
};

seedDatabase();