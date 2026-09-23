import express from 'express';
import {
  createOrder,
  verifyPayment,
  getOrders,
  createManualOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/orders', protect, admin, getOrders);
router.post('/orders/manual', protect, admin, createManualOrder);
router.put('/orders/:id', protect, admin, updateOrder);
router.delete('/orders/:id', protect, admin, deleteOrder);

export default router;
