import { EmailTemplates } from './types';
import { invoiceTemplate } from './invoiceTemplate';
import { paymentTemplate } from './paymentTemplate';
import { orderTemplate } from './orderTemplate';
import { quoteTemplate } from './quoteTemplate';

export const emailTemplates: EmailTemplates = {
  invoiceCreated: invoiceTemplate,
  paymentReceived: paymentTemplate,
  orderConfirmation: orderTemplate,
  quoteCreated: quoteTemplate,
};
