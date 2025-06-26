const Employee = require('../models/Employee');
const User = require('../models/User');

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees.map(emp => ({
      id: emp.id,
      empNo: emp.emp_no,
      firstName: emp.first_name,
      lastName: emp.last_name,
      fullName: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      mobile: emp.mobile,
      telephone: emp.telephone,
      gender: emp.gender,
      dob: emp.dob,
      department: emp.department_name,
      departmentId: emp.department_id,
      unit: emp.unit_name,
      unitId: emp.unit_id,
      position: emp.position,
      highestQualification: emp.highest_qualification,
      address: emp.address,
      country: emp.country,
      startDate: emp.start_date,
      maritalStatus: emp.marital_status,
      childrenNo: emp.children_no,
      bankName: emp.bank_name,
      accountNo: emp.account_no,
      bio: emp.bio,
      fingerprintId: emp.fingerprint_id,
      profilePicture: emp.profile_picture,
      isActive: emp.is_active,
      role: emp.user_id ? null : null // Temporarily set to null, will populate below
    })));

    // Fix: Fetch user roles in parallel for employees with user_id
    const employeesWithUserId = employees.filter(emp => emp.user_id);
    const userIds = employeesWithUserId.map(emp => emp.user_id);
    const users = await User.find({ _id: { $in: userIds } });
    const userIdToRole = {};
    users.forEach(user => {
      userIdToRole[user._id] = user.role;
    });

    // Rebuild the response with roles
    const response = employees.map(emp => ({
      id: emp.id,
      empNo: emp.emp_no,
      firstName: emp.first_name,
      lastName: emp.last_name,
      fullName: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      mobile: emp.mobile,
      telephone: emp.telephone,
      gender: emp.gender,
      dob: emp.dob,
      department: emp.department_name,
      departmentId: emp.department_id,
      unit: emp.unit_name,
      unitId: emp.unit_id,
      position: emp.position,
      highestQualification: emp.highest_qualification,
      address: emp.address,
      country: emp.country,
      startDate: emp.start_date,
      maritalStatus: emp.marital_status,
      childrenNo: emp.children_no,
      bankName: emp.bank_name,
      accountNo: emp.account_no,
      bio: emp.bio,
      fingerprintId: emp.fingerprint_id,
      profilePicture: emp.profile_picture,
      isActive: emp.is_active,
      role: emp.user_id ? userIdToRole[emp.user_id] || null : null
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const user = employee.user_id ? await User.findById(employee.user_id) : null;
    
    res.json({
      id: employee.id,
      empNo: employee.emp_no,
      firstName: employee.first_name,
      lastName: employee.last_name,
      fullName: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      mobile: employee.mobile,
      telephone: employee.telephone,
      gender: employee.gender,
      dob: employee.dob,
      department: employee.department_name,
      departmentId: employee.department_id,
      unit: employee.unit_name,
      unitId: employee.unit_id,
      position: employee.position,
      highestQualification: employee.highest_qualification,
      address: employee.address,
      country: employee.country,
      startDate: employee.start_date,
      maritalStatus: employee.marital_status,
      childrenNo: employee.children_no,
      bankName: employee.bank_name,
      accountNo: employee.account_no,
      bio: employee.bio,
      fingerprintId: employee.fingerprint_id,
      profilePicture: employee.profile_picture,
      isActive: employee.is_active,
      role: user ? user.role : null
    });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employeeData = req.body;
    
    // Create user account if role is provided
    let userId = null;
    if (employeeData.role) {
      userId = await User.create({
        username: employeeData.email.split('@')[0],
        password: 'defaultPassword123', // Should be changed on first login
        role: employeeData.role,
        email: employeeData.email
      });
    }
    
    const employeeId = await Employee.create({
      empNo: employeeData.empNo,
      userId,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      mobile: employeeData.mobile,
      telephone: employeeData.telephone,
      gender: employeeData.gender,
      dob: employeeData.dob,
      departmentId: employeeData.departmentId,
      unitId: employeeData.unitId,
      position: employeeData.position,
      highestQualification: employeeData.highestQualification,
      address: employeeData.address,
      country: employeeData.country,
      startDate: employeeData.startDate,
      maritalStatus: employeeData.maritalStatus,
      childrenNo: employeeData.childrenNo,
      bankName: employeeData.bankName,
      accountNo: employeeData.accountNo,
      bio: employeeData.bio,
      fingerprintId: employeeData.fingerprintId,
      profilePicture: employeeData.profilePicture
    });
    
    res.status(201).json({ id: employeeId });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employeeData = req.body;
    await Employee.update(req.params.id, employeeData);
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    await Employee.delete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getEmployeeStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.count();
    res.json({ totalEmployees });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
};