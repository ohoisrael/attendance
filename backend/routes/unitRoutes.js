const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const auth = require('../middleware/auth');

router.get('/', auth(), unitController.getAllUnits);
router.get('/:id', auth(), unitController.getUnitById);
router.post('/', auth(['admin']), unitController.createUnit);
router.put('/:id', auth(['admin']), unitController.updateUnit);
router.delete('/:id', auth(['admin']), unitController.deleteUnit);

module.exports = router;