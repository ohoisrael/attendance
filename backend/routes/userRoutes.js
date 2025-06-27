const express = require('express');
const { authenticateToken, restrictTo } = require('../middleware/auth');
const { getUsers, createUser, validateUser, changePassword } = require('../controllers/userController');

const router = express.Router();

router.use(authenticateToken);
router.get('/', restrictTo('admin', 'hr'), getUsers);
router.post('/', restrictTo('admin', 'hr'), validateUser, createUser);
router.put('/change-password', changePassword);

module.exports = router;