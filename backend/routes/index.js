const express = require('express');
const paymentgatewayRoutes = require('./superadmin/payment-gateway/paymentgateway');
const subscriptionRoutes = require('./superadmin/subscriptionplan/subscription');
const smtpSettingsRoutes = require('./superadmin/smtp-settings/smtpsettings');
const brandSettingsRoutes = require('./superadmin/brand/branding'); 
const freetrialRoutes = require('./superadmin/freetrial/freetrial');

const router = express.Router();

router.use('/superadmin/payment-gateways', paymentgatewayRoutes);
router.use('/superadmin/subscription-plans', subscriptionRoutes);
router.use('/superadmin/smtp-settings', smtpSettingsRoutes);
router.use('/superadmin/branding', brandSettingsRoutes); 
router.use('/superadmin/freetrial', freetrialRoutes);

module.exports = router;   