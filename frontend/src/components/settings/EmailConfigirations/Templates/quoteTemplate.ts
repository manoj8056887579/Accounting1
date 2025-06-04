import { EmailTemplate } from './types';

export const quoteTemplate: EmailTemplate = {
  subject: 'New Quote #{quote_number} from {company_name}',
  body: `Dear {customer_name},

Thank you for your interest in our products/services.

Please find attached Quote #{quote_number} for your review.

Quote details:
- Quote Number: {quote_number}
- Issue Date: {issue_date}
- Valid Until: {valid_until}
- Total Amount: {total_amount}

You can view and accept this quote online by clicking the link below:
{quote_link}

If you have any questions or would like to discuss this quote further, please don't hesitate to contact us.

Best regards,
{company_name}
{company_email}
{company_phone}`,
  enabled: true,
};
