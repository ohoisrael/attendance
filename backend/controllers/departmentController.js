const Department = require('../models/Department');
const Unit = require('../models/Unit');
const Employee = require('../models/Employee');

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    const departmentsWithDetails = await Promise.all(
      departments.map(async dept => {
        const units = await Unit.findByDepartment(dept.id);
        const employees = await Employee.findByDepartment(dept.id);
        return {
          ...dept,
          unitsCount: units.length,
          employeesCount: employees.length
        };
      })
    );
    res.json(departmentsWithDetails);
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const units = await Unit.findByDepartment(department.id);
    const employees = await Employee.findByDepartment(department.id);
    
    res.json({
      ...department,
      units,
      employees
    });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, workHours, room, description } = req.body;
    const departmentId = await Department.create({ name, workHours, room, description });
    res.status(201).json({ id: departmentId });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name, workHours, room, description } = req.body;
    await Department.update(req.params.id, { name, workHours, room, description });
    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    await Department.delete(req.params.id);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};