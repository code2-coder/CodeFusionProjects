import express from 'express';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', contactLimiter, submitContactForm);
router.get('/', protect, admin, getContactSubmissions);

export default router;
