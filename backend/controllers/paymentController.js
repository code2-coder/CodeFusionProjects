import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { amount, planName } = req.body;

    if (!amount || !planName) {
      return res.status(400).json({ message: 'Amount and plan name are required' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
    });

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR', 
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Some error occurred while creating order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount,
      planName,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Transaction not legit!' });
    }

    // Save payment to database
    const payment = new Payment({
      planName,
      amount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'success',
    });

    await payment.save();

    res.status(200).json({
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message });
  }
};
