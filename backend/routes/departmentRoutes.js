const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const auth = require('../middleware/auth');

router.get('/', auth(), departmentController.getAllDepartments);
router.get('/:id', auth(), departmentController.getDepartmentById);
router.post('/', auth(['admin']), departmentController.createDepartment);
router.put('/:id', auth(['admin']), departmentController.updateDepartment);
router.delete('/:id', auth(['admin']), departmentController.deleteDepartment);

module.exports = router;