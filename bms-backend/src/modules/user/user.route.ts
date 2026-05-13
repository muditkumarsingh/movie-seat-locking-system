import { isVerifiedUser } from '../../middleware/auth.middleware';
import * as UserController from './user.controller'
import express from 'express'

const router = express.Router()

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUser);
router.get('/me',isVerifiedUser, UserController.getUserById);
router.put('/activate/:id', isVerifiedUser,UserController.activateUser);

export default router 