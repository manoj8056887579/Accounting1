
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initWhatsAppService, getWhatsAppService } from "@/services/whatsAppService";

interface WhatsAppContextType {
  isInitialized: boolean;
  apiKey: string;
  phoneNumberId: string;
  businessAccountId: string;
  isConnected: boolean;
  setApiKey: (key: string) => void;
  setPhoneNumberId: (id: string) => void;
  setBusinessAccountId: (id: string) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('whatsapp_api_key') || '';
  });
  
  const [phoneNumberId, setPhoneNumberId] = useState<string>(() => {
    return localStorage.getItem('whatsapp_phone_number_id') || '';
  });
  
  const [businessAccountId, setBusinessAccountId] = useState<string>(() => {
    return localStorage.getItem('whatsapp_business_account_id') || '';
  });
  
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Save API credentials to localStorage whenever they change
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('whatsapp_api_key', apiKey);
    }
    if (phoneNumberId) {
      localStorage.setItem('whatsapp_phone_number_id', phoneNumberId);
    }
    if (businessAccountId) {
      localStorage.setItem('whatsapp_business_account_id', businessAccountId);
    }
  }, [apiKey, phoneNumberId, businessAccountId]);

  // Check if we should initialize the service automatically
  useEffect(() => {
    if (apiKey && phoneNumberId && businessAccountId && !isInitialized) {
      try {
        initWhatsAppService(apiKey, phoneNumberId, businessAccountId);
        setIsInitialized(true);
        // Verify connection by fetching business profile
        getWhatsAppService()
          .getBusinessProfile()
          .then(() => {
            setIsConnected(true);
          })
          .catch((err) => {
            console.error("Failed to connect to WhatsApp API:", err);
            setIsConnected(false);
          });
      } catch (err) {
        console.error("Failed to initialize WhatsApp service:", err);
        setIsInitialized(false);
      }
    }
  }, [apiKey, phoneNumberId, businessAccountId, isInitialized]);

  // Connect to WhatsApp API
  const connect = async (): Promise<boolean> => {
    if (!apiKey || !phoneNumberId || !businessAccountId) {
      return false;
    }

    try {
      initWhatsAppService(apiKey, phoneNumberId, businessAccountId);
      setIsInitialized(true);
      
      // Verify connection by fetching business profile
      await getWhatsAppService().getBusinessProfile();
      setIsConnected(true);
      return true;
    } catch (err) {
      console.error("Failed to connect to WhatsApp API:", err);
      setIsConnected(false);
      return false;
    }
  };

  // Disconnect from WhatsApp API
  const disconnect = () => {
    setIsConnected(false);
    setIsInitialized(false);
  };

  return (
    <WhatsAppContext.Provider value={{
      isInitialized,
      apiKey,
      phoneNumberId,
      businessAccountId,
      isConnected,
      setApiKey,
      setPhoneNumberId,
      setBusinessAccountId,
      connect,
      disconnect
    }}>
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error("useWhatsApp must be used within a WhatsAppProvider");
  }
  return context;
};
