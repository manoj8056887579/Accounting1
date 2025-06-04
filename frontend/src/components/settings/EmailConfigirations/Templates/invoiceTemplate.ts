import { EmailTemplate } from './types';

export const invoiceTemplate: EmailTemplate = {
  subject: 'New Invoice #{invoice_number} from {company_name}',
  body: `Dear {customer_name},

We hope this message finds you well.

Please find attached Invoice #{invoice_number} for {total_amount} due on {due_date}.

Invoice details:
- Invoice Number: {invoice_number}
- Issue Date: {issue_date}
- Due Date: {due_date}
- Total Amount: {total_amount}

You can view and pay your invoice online by clicking the link below:
{invoice_link}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
{company_name}
{company_email}
{company_phone}`,
  enabled: true,
};
