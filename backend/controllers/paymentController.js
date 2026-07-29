import { Cashfree } from "cashfree-pg";
import crypto from 'crypto';
import Payment from '../models/Payment.js';

// Setup Cashfree credentials
// Defaults to Sandbox if environment variables are not set properly
Cashfree.XClientId = process.env.CASHFREE_APP_ID || "dummy_app_id";
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || "dummy_secret_key";
Cashfree.XEnvironment = Cashfree.Environment[process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" ? "PRODUCTION" : "SANDBOX"];

// @desc    Create Cashfree Order
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { amount, planName } = req.body;

    if (!amount || !planName) {
      return res.status(400).json({ message: 'Amount and plan name are required' });
    }

    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    const request = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${crypto.randomBytes(4).toString('hex')}`,
        customer_phone: '9999999999',
        customer_name: 'Customer',
        customer_email: 'customer@example.com' // Adjust as per your auth requirements
      },
      order_meta: {
        // You can specify a return_url here if you want Cashfree to redirect
        // For seamless modal, this can be omitted or handled via frontend
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    // Create a pending payment record
    const payment = new Payment({
      planName,
      amount,
      orderId: response.data.order_id,
      paymentSessionId: response.data.payment_session_id,
      status: 'pending'
    });
    await payment.save();

    res.status(200).json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      amount: response.data.order_amount,
      currency: response.data.order_currency
    });
  } catch (error) {
    console.error('Error creating Cashfree order:', error?.response?.data || error);
    res.status(500).json({ message: error?.response?.data?.message || error.message || 'Some error occurred while creating order' });
  }
};

// @desc    Verify Cashfree Payment
// @route   POST /api/payments/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const response = await Cashfree.PGFetchPayments("2023-08-01", orderId);
    
    // Check if any transaction under this order ID is SUCCESS
    const isSuccess = response.data && response.data.some(payment => payment.payment_status === "SUCCESS");

    if (!isSuccess) {
      return res.status(400).json({ message: 'Transaction not legit or not successful!' });
    }

    // Update the payment status in the database
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { status: 'success' },
      { new: true }
    );

    if (!payment) {
        return res.status(404).json({ message: 'Payment record not found for this order' });
    }

    res.status(200).json({
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    console.error('Error verifying Cashfree payment:', error?.response?.data || error);
    res.status(500).json({ message: error?.response?.data?.message || error.message || 'Verification failed' });
  }
};
