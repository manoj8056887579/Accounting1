const pool = require('../../../utils/config/connectDB');
const Razorpay = require('razorpay');
const subscriptionSchema = require('../../../utils/models/superadmin/subscriptionplan/SubscriptionSchema');
const PaymentgatewaySchema = require('../../../utils/models/superadmin/paymentgateway/PaymentGatewaySchema');
// Schema initialization is now handled by initDB.js
const initializeSchema = async () => {
  // Skip local initialization as it's handled by initDB.js
  return Promise.resolve();
};

// Payment gateway schema initialization is now handled by initDB.js
const initializePaymentGatewaySchema = async () => {
  // Skip local initialization as it's handled by initDB.js
  return Promise.resolve();
};

// Get Razorpay instance with credentials
const getRazorpayInstance = async () => {
  const client = await pool.connect();
  try {
    // Ensure payment gateway schema is initialized
    await initializePaymentGatewaySchema();
    
    // Query the payment_gateways table for Razorpay configuration
    const result = await client.query(
      'SELECT * FROM payment_gateways WHERE gateway = $1 AND is_active = true',
      ['razorpay']
    );
    
    if (result.rows.length === 0) {
      throw new Error('No active Razorpay configuration found');
    }

    const config = result.rows[0];
    
    // Validate required credentials
    if (!config.api_key || !config.api_secret) {
      throw new Error('Razorpay API credentials are missing');
    }

    // Validate API key format
    if (config.is_test_mode && !config.api_key.startsWith('rzp_test_')) {
      throw new Error('Invalid test mode API key format');
    }
    if (!config.is_test_mode && !config.api_key.startsWith('rzp_live_')) {
      throw new Error('Invalid live mode API key format');
    }

    // Create Razorpay instance with credentials
    const razorpay = new Razorpay({
      key_id: config.api_key,
      key_secret: config.api_secret
    });

    // Test the connection
    try {
      await razorpay.plans.all();
      console.log('Successfully connected to Razorpay');
    } catch (error) {
      console.error('Error testing Razorpay connection:', error);
      throw new Error('Failed to connect to Razorpay. Please check your credentials.');
    }

    return razorpay;
  } catch (error) {
    console.error('Error getting Razorpay instance:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Map our intervals to Razorpay periods
const mapIntervalToRazorpayPeriod = (interval) => {
  const mapping = {
    'monthly': 'monthly',
    'yearly': 'yearly'
  };
  return mapping[interval];
};

// Get interval multiplier for Razorpay
const getIntervalMultiplier = (interval) => {
  const mapping = {
    'monthly': 1,
    'yearly': 1
  };
  return mapping[interval];
};

// Add validation middleware
const validateSubscriptionPlan = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.length < 3) {
    errors.push('Name must be at least 3 characters long');
  }
  
  if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  if (!data.currency || !['INR', 'USD', 'EUR', 'GBP'].includes(data.currency)) {
    errors.push('Invalid currency code');
  }
  
  if (!data.interval || !['monthly', 'yearly'].includes(data.interval)) {
    errors.push('Invalid interval');
  }
  
  if (!Array.isArray(data.features)) {
    errors.push('Features must be an array');
  }
  
  if (typeof data.userLimit !== 'number' || data.userLimit < 0) {
    errors.push('User limit must be a non-negative number');
  }
  
  if (!Array.isArray(data.modules)) {
    errors.push('Modules must be an array');
  }

  if (typeof data.isPublished !== 'boolean') {
    errors.push('Published status must be a boolean');
  }

  if (typeof data.isPopular !== 'boolean') {
    errors.push('Popular status must be a boolean');
  }
  
  return errors;
};

exports.getSubscriptionPlans = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM subscription_plans ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans',
      error: error.message
    });
  } finally {
    client.release();
  }
};

exports.postSubscriptionPlans = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      name,
      description,
      price,
      currency,
      interval,
      features,
      userLimit,
      modules,
      isPopular,
      isPublished
    } = req.body;

    // Validate input data
    const validationErrors = validateSubscriptionPlan(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // If this plan is marked as popular, unmark any existing popular plan for this interval
    if (isPopular) {
      await client.query(
        'UPDATE subscription_plans SET is_popular = false WHERE interval = $1 AND is_popular = true',
        [interval]
      );
    }

    // Get Razorpay instance
    const razorpay = await getRazorpayInstance();

    // Create plan in Razorpay
    const razorpayPlan = await razorpay.plans.create({
      period: mapIntervalToRazorpayPeriod(interval),
      interval: getIntervalMultiplier(interval),
      item: {
        name: name,
        description: description,
        amount: Math.round(price * 100),
        currency: currency || 'INR'
      }
    });

    // Check if plan with same name and interval exists
    const existingPlan = await client.query(
      'SELECT id FROM subscription_plans WHERE name = $1 AND interval = $2',
      [name, interval]
    );

    if (existingPlan.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `A ${name} plan already exists for ${interval} interval`
      });
    }

    // Insert into database with Razorpay plan ID
    const result = await client.query(
      `INSERT INTO subscription_plans 
       (name, description, price, currency, interval, features, user_limit, modules, is_popular, is_published, razorpay_plan_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        name,
        description,
        price,
        currency || 'INR',
        interval,
        JSON.stringify(features || []),
        userLimit || 0,
        JSON.stringify(modules || []),
        isPopular || false,
        isPublished || false,
        razorpayPlan.id
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: result.rows[0],
      razorpayPlanId: razorpayPlan.id
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating subscription plan:', error);
    
    if (error.message.includes('unique_popular_per_interval')) {
      return res.status(400).json({
        success: false,
        message: 'Only one plan can be marked as popular per interval'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating subscription plan',
      error: error.message
    });
  } finally {
    client.release();
  }
};

exports.putSubscriptionPlan = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { isPublished, isPopular } = req.body;

    // Validate input
    if (typeof isPublished !== 'boolean' && typeof isPopular !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'At least one of isPublished or isPopular must be provided as a boolean value'
      });
    }

    // Check if plan exists
    const checkResult = await client.query(
      'SELECT * FROM subscription_plans WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    const plan = checkResult.rows[0];

    // If marking as popular, unmark any existing popular plan for this interval
    if (isPopular) {
      await client.query(
        'UPDATE subscription_plans SET is_popular = false WHERE interval = $1 AND id != $2 AND is_popular = true',
        [plan.interval, id]
      );
    }

    // Update the plan status
    const result = await client.query(
      `UPDATE subscription_plans 
       SET is_published = COALESCE($1, is_published),
           is_popular = COALESCE($2, is_popular),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [isPublished, isPopular, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update subscription plan'
      });
    }

    const updatedPlan = result.rows[0];
    const messages = [];
    if (typeof isPublished === 'boolean') {
      messages.push(`Plan ${isPublished ? 'published' : 'unpublished'}`);
    }
    if (typeof isPopular === 'boolean') {
      messages.push(`Plan ${isPopular ? 'marked as popular' : 'unmarked as popular'}`);
    }

    res.json({
      success: true,
      data: updatedPlan,
      message: messages.join(' and ') + ' successfully'
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    
    if (error.message.includes('unique_popular_per_interval')) {
      return res.status(400).json({
        success: false,
        message: 'Only one plan can be marked as popular per interval'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating subscription plan',
      error: error.message
    });
  } finally {
    client.release();
  }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    // Check if plan exists and get Razorpay plan ID
    const checkResult = await client.query(
      'SELECT * FROM subscription_plans WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    const plan = checkResult.rows[0];

    // Delete from Razorpay if plan ID exists
    if (plan.razorpay_plan_id) {
      try {
        const razorpay = await getRazorpayInstance();
        await razorpay.plans.delete(plan.razorpay_plan_id);
      } catch (error) {
        console.error('Error deleting Razorpay plan:', error);
        // Continue with database deletion even if Razorpay deletion fails
      }
    }

    // Delete from database
    await client.query( 
      'DELETE FROM subscription_plans WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription plan',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Initialize schema when the module is loaded
initializeSchema().catch(console.error);






 
