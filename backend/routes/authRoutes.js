import express from 'express';
import { requestOtp, verifyOtp, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.put('/profile', protect, updateProfile);

export default router;
