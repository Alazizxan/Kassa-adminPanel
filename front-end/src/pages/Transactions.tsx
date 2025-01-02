import React, { useState, useEffect } from 'react';
import { getMonthlyTransactions } from '../services/api';
import { TransactionCard } from '../components/TransactionCard';
import { Transaction } from '../types';

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const currentDate = new Date();
        const { transactions } = await getMonthlyTransactions(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        setTransactions(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Transactions</h1>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};