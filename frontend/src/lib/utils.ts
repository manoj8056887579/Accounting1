
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique IDs for mock data
export function generateId(): string {
  return uuidv4();
}

// Format currency to INR
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

