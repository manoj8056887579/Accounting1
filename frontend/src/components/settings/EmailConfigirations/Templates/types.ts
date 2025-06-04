export interface EmailTemplate {
  subject: string;
  body: string;
  enabled: boolean;
}

export interface EmailTemplates {
  invoiceCreated: EmailTemplate;
  paymentReceived: EmailTemplate;
  orderConfirmation: EmailTemplate;
  quoteCreated: EmailTemplate;
}
