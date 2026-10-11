import express from 'express';
import { 
  requestOtp, 
  verifyOtp, 
  updateProfile,
  getAllUsers,
  updateUserRole,
  toggleUserVerification,
  deleteUser
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public auth routes
router.post('/request-otp', authLimiter, requestOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.put('/profile', protect, updateProfile);

// Admin-only user management routes
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.put('/users/:id/verify', protect, admin, toggleUserVerification);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
