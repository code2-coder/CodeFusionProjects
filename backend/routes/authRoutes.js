import express from 'express';
import { requestOtp, verifyOtp, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/request-otp', authLimiter, requestOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.put('/profile', protect, updateProfile);

export default router;
