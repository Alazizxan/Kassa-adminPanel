import React from 'react';
import { useApi } from '../hooks/useApi';
import { getMonthlyTransactions, getTransactionsTotal } from '../services/api';
import { TransactionCard } from '../components/TransactionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorFallback } from '../components/ErrorBoundary';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';


export const Dashboard = () => {
  const currentDate = new Date();
  const { data, loading, error } = useApi(() => 
    getTransactionsTotal()
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  if (!data) return null;

  const { transactions, totals } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Wallet className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                {totals.totalDeposit - (totals.totalWithdrawal || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Wallet className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                {totals.totalDeposit - (totals.totalWithdrawal || 0)}
              </p>
            </div>
          </div>
          </div>
        
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-green-500">
                +{totals.totalDeposit || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingDown className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-400">Total Withdrawals</p>
              <p className="text-2xl font-bold text-red-500">
                -{totals.totalWithdrawal || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};