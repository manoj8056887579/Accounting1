
import { ReactNode } from 'react';

// Common document type that captures shared properties used in the document list
export interface Document {
  id: string;
  reference: string;
  vendor: string;
  date: string;
  status: string;
  total: number; // Added the total property that was missing
  [key: string]: any;
}

// Type for the additional action prop in PurchaseDocumentList
export interface AdditionalAction {
  label: string | ((doc: Document) => string);
  icon: ReactNode | ((doc: Document) => ReactNode);
  onClick: (doc: Document) => void;
  showFor: (doc: Document) => boolean;
}

// Type for status colors
export interface StatusColor {
  bg: string;
  text: string;
}

export interface StatusColors {
  [key: string]: StatusColor;
}
