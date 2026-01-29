// Authentication routes - Login, signup, logout endpoints
import express from 'express';
import { signup, login, googleAuthentication, forgotPassword, verifyOtp, resetPassword, getUserProfile, updateUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-auth', googleAuthentication);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/user/:userId', getUserProfile);
router.put('/user/:userId', updateUserProfile);

export default router;
