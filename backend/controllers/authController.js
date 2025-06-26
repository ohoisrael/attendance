const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { log } = require('console');

const login = async (req, res, next) => {
  try {
    
    const { username, password } = req.body;
    
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const employee = await Employee.findByUserId(user.id);
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        employee: employee ? {
          id: employee.id,
          empNo: employee.emp_no,
          fullName: `${employee.first_name} ${employee.last_name}`,
          department: employee.department_name,
          unit: employee.unit_name,
          profilePicture: employee.profile_picture
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const employee = await Employee.findByUserId(user.id);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        employee: employee ? {
          id: employee.id,
          empNo: employee.emp_no,
          fullName: `${employee.first_name} ${employee.last_name}`,
          department: employee.department_name,
          unit: employee.unit_name,
          profilePicture: employee.profile_picture
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getCurrentUser
};