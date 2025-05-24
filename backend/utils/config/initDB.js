const pool = require('./connectDB');
const paymentGatewaySchema = require('../models/superadmin/paymentgateway/PaymentGatewaySchema');
const subscriptionSchema = require('../models/superadmin/subscriptionplan/SubscriptionSchema')
const SmtpSettingsSchema = require('../models/superadmin/smtp/smtpSchema'); 
const brandSettingsSchema = require('../models/superadmin/brand/BrandSchema');
const freetrialSchema = require('../models/superadmin/freetrial/FreeTrialSchema');

async function initializeDatabase(retryCount = 0) {
  const MAX_RETRIES = 3;
  const client = await pool.connect();
  
  try {
    // Set transaction isolation level to serializable to prevent concurrent schema modifications
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
    
    // Add advisory lock to prevent concurrent schema modifications
    await client.query('SELECT pg_advisory_xact_lock(1)');
    
    // Create payment_gateways table
    await client.query(paymentGatewaySchema); 
    await client.query(subscriptionSchema);
    await client.query(SmtpSettingsSchema);
    await client.query(brandSettingsSchema);
    await client.query(freetrialSchema);
    
    await client.query('COMMIT');
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    
    // Handle concurrent update errors
    if ((error.code === 'XX000' || error.code === '42P07') && retryCount < MAX_RETRIES) {
      console.log(`Retrying database initialization (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return initializeDatabase(retryCount + 1);
    }
    
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}
 
module.exports = initializeDatabase;
 