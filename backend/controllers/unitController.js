const Unit = require('../models/Unit');
const Employee = require('../models/Employee');

const getAllUnits = async (req, res, next) => {
  try {
    const units = await Unit.findAll();
    const unitsWithDetails = await Promise.all(
      units.map(async unit => {
        const employees = await Employee.findByDepartment(unit.department_id);
        const unitEmployees = employees.filter(emp => emp.unit_id === unit.id);
        return {
          ...unit,
          employeesCount: unitEmployees.length
        };
      })
    );
    res.json(unitsWithDetails);
  } catch (error) {
    next(error);
  }
};

const getUnitById = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    
    const employees = await Employee.findByDepartment(unit.department_id);
    const unitEmployees = employees.filter(emp => emp.unit_id === unit.id);
    
    res.json({
      ...unit,
      employees: unitEmployees
    });
  } catch (error) {
    next(error);
  }
};

const createUnit = async (req, res, next) => {
  try {
    const { name, departmentId, headOfUnit, description } = req.body;
    const unitId = await Unit.create({ name, departmentId, headOfUnit, description });
    res.status(201).json({ id: unitId });
  } catch (error) {
    next(error);
  }
};

const updateUnit = async (req, res, next) => {
  try {
    const { name, departmentId, headOfUnit, description } = req.body;
    await Unit.update(req.params.id, { name, departmentId, headOfUnit, description });
    res.json({ message: 'Unit updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteUnit = async (req, res, next) => {
  try {
    await Unit.delete(req.params.id);
    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit
};