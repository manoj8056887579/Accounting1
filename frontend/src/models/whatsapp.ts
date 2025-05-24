
// WhatsApp Data Models
export type MessageType = 'text' | 'template' | 'media' | 'interactive';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type ContactStatus = 'active' | 'inactive' | 'blocked';
export type SignupStatus = 'pending' | 'verified' | 'rejected';

export interface WhatsAppMessage {
  id: string;
  type: MessageType;
  content: string;
  sender: string; // phone number or internal user ID
  recipient: string; // phone number
  status: MessageStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  status: ContactStatus;
  tags: string[];
  lastContact?: string; // ISO date string
  notes?: string;
  customer_id?: string; // Link to customer in CRM
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: string[]; // placeholders in the template
  status: 'approved' | 'pending' | 'rejected';
  language: string;
}

export interface WhatsAppBroadcast {
  id: string;
  name: string;
  type: MessageType;
  content: string;
  audience: string; // target segment
  audienceCount: number;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  scheduledFor?: string; // ISO date string
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdAt: string;
  createdBy: string;
}

export interface WhatsAppSettings {
  apiKey: string;
  phoneNumber: string;
  businessName: string;
  businessDescription: string;
  webhookUrl: string;
  status: 'active' | 'inactive' | 'pending';
  notificationSettings: {
    incomingMessages: boolean;
    messageDelivered: boolean;
    messageRead: boolean;
    broadcastComplete: boolean;
    emailNotifications: boolean;
  };
}

export interface WhatsAppBusinessAccount {
  id: string;
  businessPhone: string;
  businessName: string;
  businessCategory: string;
  email: string;
  signupDate: string;
  status: SignupStatus;
  verificationCode?: string;
  verifiedDate?: string;
}
