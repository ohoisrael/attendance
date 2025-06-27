const express = require('express');
const router = express.Router();
const zktecoController = require('../controllers/zktecoController');

router.get('/logs', zktecoController.getLogs);
router.get('/users', zktecoController.getUsers);
router.post('/users', zktecoController.addUser);
router.delete('/users/:uid', zktecoController.deleteUser);

module.exports = router;
