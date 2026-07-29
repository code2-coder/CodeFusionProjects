import express from 'express';
import { createOrder, verifyPayment, getOrders, createManualOrder, updateOrder, deleteOrder } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/orders', getOrders); // Note: add protect middleware in production
router.post('/orders/manual', createManualOrder);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);
export default router;
