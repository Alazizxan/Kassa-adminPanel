import axios from 'axios';
import { User, Transaction, TransactionResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (!error.response) {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
);

export const getUser = async (telegramId: string): Promise<{ user: User; transactions: Transaction[] }> => {
  try {
    const response = await api.get(`/user/${telegramId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export const getTransactionsByGame = async (gameId: string): Promise<TransactionResponse> => {
  try {
    const response = await api.get(`/transactions/game/${gameId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch game transactions');
  }
};

export const getMonthlyTransactions = async (year: number, month: number): Promise<TransactionResponse> => {
  try {
    const response = await api.get(`/transactions/month-total?year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch monthly transactions');
  }
};

export const getTransactionsTotal = async (): Promise<TransactionResponse> => {
  try {
    const response = await api.get(`/api/transaction-totals`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch game transactions');
  }
};