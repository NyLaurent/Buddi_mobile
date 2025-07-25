/**
 * 💳 Payment Services
 * 
 * Payment processing, financial transactions, and billing
 */

import { authorizedApi } from '../api/config';

export async function getTokenBalance(parentId: number | string) {
  const res = await authorizedApi.get(`/payments/tokenBalance/${parentId}`);
  // API returns: { parentId, tokens }
  return res.data;
}

export async function buyTokens({ parentId, quantity, amount }: { parentId: number | string, quantity: number, amount: number }) {
  const res = await authorizedApi.post('/payments/buyTokens', { parentId, quantity, amount });
  // API returns: { success, message, checkoutUrl? }
  return res.data;
}

// Payment types and configurations
export interface PaymentConfig {
  currency: string;
  enableTestMode: boolean;
  publishableKey: string;
}

export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_ACCOUNT: 'bank_account',
  DIGITAL_WALLET: 'digital_wallet',
} as const;

// Placeholder exports for future implementation
export const PaymentServices = {
  // Will be populated as services are implemented
} as const; 