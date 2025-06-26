const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

router.get('/', auth(), employeeController.getAllEmployees);
router.get('/stats', auth(), employeeController.getEmployeeStats);
router.get('/:id', auth(), employeeController.getEmployeeById);
router.post('/', auth(['admin', 'hr']), employeeController.createEmployee);
router.put('/:id', auth(['admin', 'hr']), employeeController.updateEmployee);
router.delete('/:id', auth(['admin']), employeeController.deleteEmployee);

module.exports = router;