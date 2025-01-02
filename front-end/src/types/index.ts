export interface Transaction {
  _id: string;
  userId: string;
  telegramId: string;
  type: 'withdrawal' | 'deposit';
  platform: string;
  cardNumber: string;
  amount?: number;
  operationId?: string;
  timestamp: string;
  status?: string;
  paymentId?: string;
  error?: string | null;
  expiryDate?: string;
}

export interface User {
  _id: string;
  telegramId: string;
  refferalId: string;
  username: string;
  fullName: string;
  registrationDate: string;
  lastActive: string;
  isActive: boolean;
  isAdmin: boolean;
  phone?: string;
}

export interface TransactionTotals {
  totalDeposit: number;
  totalWithdrawal: number | null;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totals: TransactionTotals;
}