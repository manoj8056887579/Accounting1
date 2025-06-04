import { EmailTemplate } from './types';

export const orderTemplate: EmailTemplate = {
  subject: 'Order Confirmation #{order_number}',
  body: `Dear {customer_name},

Thank you for your order!

We're writing to confirm that we've received your order #{order_number} and are processing it now.

Order details:
- Order Number: {order_number}
- Order Date: {order_date}
- Total Amount: {order_total}

You can track your order status here: {order_tracking_link}

If you have any questions about your order, please contact us.

Best regards,
{company_name}
{company_email}
{company_phone}`,
  enabled: true,
};
