import express from 'express';
import { authenticateToken, restrictTo } from '../middleware/auth.js';
import { getUsers, createUser, validateUser } from '../controllers/userController.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', restrictTo('admin', 'hr'), getUsers);
router.post('/', restrictTo('admin', 'hr'), validateUser, createUser);

export default router;