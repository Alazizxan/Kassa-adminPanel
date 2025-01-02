import React, { useState } from 'react';
import { getUser, getTransactionsByGame } from '../services/api';
import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorFallback } from '../components/ErrorBoundary';
import { User, Transaction, TransactionTotals } from '../types';

export const Users = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<User | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<TransactionTotals | undefined>();

  const handleSearch = async (type: 'telegram' | 'game', id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (type === 'telegram') {
        const response = await getUser(id);
        setUser(response.user);
        setTransactions(response.transactions);
        setTotals(undefined);
      } else {
        const response = await getTransactionsByGame(id);
        setUser(response.user);
        setTransactions(response.transactions);
        setTotals(response.totals);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
        Search Users & Transactions
      </h1>
      
      <SearchForm onSearch={handleSearch} />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorFallback error={error} resetErrorBoundary={() => setError(null)} />
      ) : (
        <SearchResults user={user} transactions={transactions} totals={totals} />
      )}
    </div>
  );
};