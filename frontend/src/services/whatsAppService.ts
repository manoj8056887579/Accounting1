
import { WhatsAppMessage, WhatsAppContact, WhatsAppTemplate, WhatsAppBroadcast } from "@/models/whatsapp";

const WHATSAPP_API_BASE_URL = "https://graph.facebook.com/v19.0";

export class WhatsAppService {
  private apiKey: string;
  private phoneNumberId: string;
  private businessAccountId: string;

  constructor(apiKey: string, phoneNumberId: string, businessAccountId: string) {
    this.apiKey = apiKey;
    this.phoneNumberId = phoneNumberId;
    this.businessAccountId = businessAccountId;
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET',
    data?: any
  ): Promise<T> {
    const url = `${WHATSAPP_API_BASE_URL}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`WhatsApp API error: ${errorData.error?.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('WhatsApp API request failed:', error);
      throw error;
    }
  }

  // Send a text message
  async sendTextMessage(to: string, text: string): Promise<any> {
    return this.makeRequest(`${this.phoneNumberId}/messages`, 'POST', {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        body: text
      }
    });
  }

  // Send a template message
  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    language: string = "en_US",
    components: any[] = []
  ): Promise<any> {
    return this.makeRequest(`${this.phoneNumberId}/messages`, 'POST', {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: language
        },
        components
      }
    });
  }

  // Get all templates
  async getTemplates(): Promise<any> {
    return this.makeRequest(`${this.businessAccountId}/message_templates`);
  }

  // Create a new template
  async createTemplate(templateData: any): Promise<any> {
    return this.makeRequest(`${this.businessAccountId}/message_templates`, 'POST', templateData);
  }

  // Get phone numbers
  async getPhoneNumbers(): Promise<any> {
    return this.makeRequest(`${this.businessAccountId}/phone_numbers`);
  }

  // Check business profile
  async getBusinessProfile(): Promise<any> {
    return this.makeRequest(`${this.phoneNumberId}/whatsapp_business_profile`);
  }

  // Update business profile
  async updateBusinessProfile(data: { 
    about?: string;
    address?: string;
    description?: string;
    email?: string;
    websites?: string[];
    vertical?: string;
  }): Promise<any> {
    return this.makeRequest(`${this.phoneNumberId}/whatsapp_business_profile`, 'POST', {
      ...data,
      messaging_product: "whatsapp"
    });
  }

  // Get message status
  async getMessageStatus(messageId: string): Promise<any> {
    return this.makeRequest(`${this.phoneNumberId}/messages/${messageId}`);
  }

  // Mock method to retrieve contacts (API doesn't directly provide this)
  async getContacts(): Promise<WhatsAppContact[]> {
    // In a real implementation, you would store contacts in your own database
    // This is a placeholder
    console.log("Called getContacts with WhatsApp API");
    return [];
  }
}

let whatsAppService: WhatsAppService | null = null;

// Initialize the WhatsApp service
export const initWhatsAppService = (apiKey: string, phoneNumberId: string, businessAccountId: string) => {
  whatsAppService = new WhatsAppService(apiKey, phoneNumberId, businessAccountId);
  return whatsAppService;
};

// Get the WhatsApp service instance
export const getWhatsAppService = () => {
  if (!whatsAppService) {
    throw new Error("WhatsApp service not initialized. Call initWhatsAppService first.");
  }
  return whatsAppService;
};
