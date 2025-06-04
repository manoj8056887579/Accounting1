import { EmailTemplate } from './types';

export const paymentTemplate: EmailTemplate = {
  subject: 'Payment Confirmation for Invoice #{invoice_number}',
  body: `Dear {customer_name},

Thank you for your payment of {payment_amount} for Invoice #{invoice_number}.

Payment details:
- Payment Amount: {payment_amount}
- Payment Date: {payment_date}
- Payment Method: {payment_method}
- Invoice Number: {invoice_number}

If you have any questions, please don't hesitate to contact us.

Best regards,
{company_name}
{company_email}
{company_phone}`,
  enabled: true,
};
