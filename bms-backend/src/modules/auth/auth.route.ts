import express from 'express'
import * as AuthController from './auth.controller'
import { isVerifiedUser } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/send-otp',AuthController.sendOtp);
router.post('/verify-otp',AuthController.verifyOTP);
router.get('/refresh-token',AuthController.refreshToken);
router.post('/logout',isVerifiedUser,AuthController.logout); //only active once 

export default router;
