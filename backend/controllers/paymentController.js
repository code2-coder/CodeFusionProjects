import { Cashfree, CFEnvironment } from "cashfree-pg";
import crypto from 'crypto';
import Payment from '../models/Payment.js';

// Setup Cashfree credentials
// Instantiate Cashfree class for v6 SDK
const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "dummy_app_id",
  process.env.CASHFREE_SECRET_KEY || "dummy_secret_key"
);

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
    const orderAmount = parseFloat(amount);

    if (isNaN(orderAmount) || orderAmount <= 0) {
      return res.status(400).json({ message: 'Invalid order amount' });
    }

    const request = {
      order_amount: orderAmount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${crypto.randomBytes(4).toString('hex')}`,
        customer_phone: '9999999999',
        customer_name: planName || 'Customer',
        customer_email: 'customer@example.com' // Adjust as per your auth requirements
      },
      order_meta: {
        // You can specify a return_url here if you want Cashfree to redirect
        // For seamless modal, this can be omitted or handled via frontend
      }
    };

    console.log('Sending CreateOrderRequest to Cashfree:', JSON.stringify(request, null, 2));

    // SDK v6 expects the request object as the first parameter for PGCreateOrder.
    // It NO LONGER takes the api version string ("2023-08-01") as the first parameter.
    const response = await cashfree.PGCreateOrder(request);
    
    console.log('Received CreateOrderResponse from Cashfree:', JSON.stringify(response.data, null, 2));

    // Create a pending payment record
    const payment = new Payment({
      planName,
      amount: orderAmount,
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

    // In SDK v6, the method is PGOrderFetchPayments and expects order_id as the first parameter.
    const response = await cashfree.PGOrderFetchPayments(orderId);
    
    console.log(`Received FetchPaymentsResponse for Order ${orderId}:`, JSON.stringify(response.data, null, 2));

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
