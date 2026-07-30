import { Cashfree, CFEnvironment } from "cashfree-pg";
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import { sendOrderConfirmation } from '../utils/sendEmail.js';

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
    const { amount, planName, user, templateId } = req.body;

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
        customer_id: user?._id || `cust_${crypto.randomBytes(4).toString('hex')}`,
        customer_phone: user?.phone || '9999999999',
        customer_name: user?.name || planName || 'Customer',
        customer_email: user?.email || 'customer@example.com'
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
      status: 'pending',
      user: user?._id || null,
      userName: user?.name || null,
      userEmail: user?.email || null,
      userPhone: user?.phone || null,
      templateId: templateId || null
    });
    await payment.save();

    res.status(200).json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      amount: response.data.order_amount,
      currency: response.data.order_currency,
      environment: process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" ? "production" : "sandbox"
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

    // Populate user if needed, or we can use payment fields since we just added userEmail to the Payment model
    if (payment.userEmail) {
      await sendOrderConfirmation(payment.userEmail, {
        customerName: payment.userName,
        planName: payment.planName,
        amount: payment.amount,
        orderId: payment.orderId,
      });
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

// @desc    Get all orders (Admin)
// @route   GET /api/payments/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Payment.find({})
      .populate('templateId', 'title category price thumbnail')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Create Manual Order (Offline/Admin)
// @route   POST /api/payments/orders/manual
// @access  Private/Admin
export const createManualOrder = async (req, res) => {
  try {
    const { userName, userEmail, userPhone, planName, amount, status } = req.body;
    
    const payment = new Payment({
      planName: planName || 'Manual Order',
      amount: amount || 0,
      orderId: `manual_${crypto.randomBytes(8).toString('hex')}`,
      paymentSessionId: 'manual',
      status: status || 'success',
      userName,
      userEmail,
      userPhone
    });
    
    const createdPayment = await payment.save();
    
    if (createdPayment.status === 'success' && createdPayment.userEmail) {
      await sendOrderConfirmation(createdPayment.userEmail, {
        customerName: createdPayment.userName,
        planName: createdPayment.planName,
        amount: createdPayment.amount,
        orderId: createdPayment.orderId,
      });
    }

    res.status(201).json(createdPayment);
  } catch (error) {
    console.error('Error creating manual order:', error);
    res.status(500).json({ message: 'Failed to create manual order' });
  }
};

// @desc    Update Order
// @route   PUT /api/payments/orders/:id
// @access  Private/Admin
export const updateOrder = async (req, res) => {
  try {
    const { userName, userEmail, userPhone, status, amount } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Order not found' });
    }

    payment.userName = userName || payment.userName;
    payment.userEmail = userEmail || payment.userEmail;
    payment.userPhone = userPhone || payment.userPhone;
    payment.status = status || payment.status;
    
    if (amount !== undefined) {
      payment.amount = amount;
    }

    const updatedPayment = await payment.save();
    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// @desc    Delete Order
// @route   DELETE /api/payments/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};
