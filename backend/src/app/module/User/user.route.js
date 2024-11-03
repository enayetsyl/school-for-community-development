import express from 'express';
import { UserControllers } from './user.controller.js';
import { isSuperUser } from '../../middlewares/auth.js';
const router = express.Router();

router.post('/create-user', UserControllers.createUser);
router.post('/login', UserControllers.login);
router.get('/get-all-users', isSuperUser, UserControllers.getAllUsers);
router.put('/verify-user/:userId', isSuperUser, UserControllers.verifyUser);

export const UserRoutes = router;