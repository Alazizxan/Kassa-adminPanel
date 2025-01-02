import React from 'react';
import { User, Transaction } from '../types';
import { UserCard } from './UserCard';
import { TransactionCard } from './TransactionCard';

interface SearchResultsProps {
  user?: User;
  transactions: Transaction[];
  totals?: {
    totalDeposit: number;
    totalWithdrawal: number | null;
  };
}

export const SearchResults: React.FC<SearchResultsProps> = ({ user, transactions, totals }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      {user && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">User Information</h2>
          <UserCard user={user} />
        </div>
      )}
      
      {transactions.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">Transactions</h2>
            {totals && (
              <div className="flex flex-wrap gap-3 text-sm sm:text-base">
                <span className="text-green-500">Deposits: +{totals.totalDeposit || 0}</span>
                <span className="text-red-500">Withdrawals: -{totals.totalWithdrawal || 0}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard key={transaction._id} transaction={transaction} />
            ))}
          </div>
        </div>
      )}
      
      {!user && transactions.length === 0 && (
        <div className="text-center text-gray-400 py-6 sm:py-8">
          No results found
        </div>
      )}
    </div>
  );
};