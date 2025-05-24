const { getRazorpayInstance } = require('../../../utils/config/connectRazorpay');
const crypto = require('crypto');
const pool = require('../../../utils/config/connectDB');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount' 
      });
    }

    // Get settings from database
    const settingsQuery = `
      SELECT api_key, api_secret, is_test_mode
      FROM payment_gateways
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const settingsResult = await pool.query(settingsQuery);
    
    if (settingsResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment gateway not configured'
      });
    }

    const settings = settingsResult.rows[0];
    const razorpay = getRazorpayInstance(settings.api_key, settings.api_secret);

    const options = {
      amount: Math.round(amount), // amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Store order details in database
    const insertOrderQuery = `
      INSERT INTO razorpay_orders (
        order_id,
        amount,
        currency,
        receipt,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `;

    await pool.query(insertOrderQuery, [
      order.id,
      order.amount,
      order.currency,
      order.receipt,
      order.status
    ]);

    res.json({
      success: true,
      orderId: order.id,
      apiKey: settings.api_key,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Get settings from database
    const settingsQuery = `
      SELECT api_key, api_secret, webhook_secret
      FROM payment_gateways
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const settingsResult = await pool.query(settingsQuery);
    
    if (settingsResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment gateway not configured'
      });
    }

    const settings = settingsResult.rows[0];

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', settings.api_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Save failure data
      await this.savePaymentFailure(razorpay_order_id, {
        reason: 'signature_verification_failed',
        code: 'INVALID_SIGNATURE',
        description: 'Payment signature verification failed'
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order status in database
    const updateOrderQuery = `
      UPDATE razorpay_orders
      SET 
        payment_id = $1,
        payment_signature = $2,
        status = 'paid',
        updated_at = NOW()
      WHERE order_id = $3
    `;

    await pool.query(updateOrderQuery, [
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id
    ]);

    res.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Handle payment failure
exports.handlePaymentFailure = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      error_code,
      error_description,
      error_reason
    } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    await this.savePaymentFailure(razorpay_order_id, {
      reason: error_reason || 'payment_failed',
      code: error_code || 'UNKNOWN_ERROR',
      description: error_description || 'Payment failed due to unknown reason'
    });

    res.json({
      success: true,
      message: 'Payment failure recorded successfully'
    });

  } catch (error) {
    console.error('Error handling payment failure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment failure',
      error: error.message
    });
  }
};

// Save payment failure data (internal function)
exports.savePaymentFailure = async (orderId, failureData) => {
  try {
    const updateFailureQuery = `
      UPDATE razorpay_orders
      SET 
        status = 'failed',
        failure_reason = $1,
        failure_code = $2,
        failure_description = $3,
        updated_at = NOW()
      WHERE order_id = $4
    `;

    await pool.query(updateFailureQuery, [
      failureData.reason,
      failureData.code,
      failureData.description,
      orderId
    ]);

    console.log(`Payment failure recorded for order: ${orderId}`);
  } catch (error) {
    console.error('Error saving payment failure:', error);
    throw error;
  }
};

// Get payment failure details
exports.getPaymentFailures = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const failuresQuery = `
      SELECT 
        order_id,
        amount,
        currency,
        receipt,
        failure_reason,
        failure_code,
        failure_description,
        created_at,
        updated_at
      FROM razorpay_orders
      WHERE status = 'failed'
      ORDER BY updated_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM razorpay_orders
      WHERE status = 'failed'
    `;

    const [failuresResult, countResult] = await Promise.all([
      pool.query(failuresQuery, [limit, offset]),
      pool.query(countQuery)
    ]);

    res.json({
      success: true,
      data: failuresResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching payment failures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment failures',
      error: error.message
    });
  }
};
