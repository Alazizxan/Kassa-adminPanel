import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const isDeposit = transaction.type === 'deposit';

  return (
    <div className="bg-gray-800 rounded-lg p-3 sm:p-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-1.5 sm:p-2 rounded-full ${isDeposit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isDeposit ? (
              <ArrowUpRight className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ArrowDownRight className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
          <div>
            <p className="text-sm sm:text-base text-white font-medium capitalize">{transaction.type}</p>
            <p className="text-xs sm:text-sm text-gray-400">{format(new Date(transaction.timestamp), 'PPp')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm sm:text-base font-semibold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
            {transaction.amount ? `${isDeposit ? '+' : '-'}${Math.abs(transaction.amount)}` : 'N/A'}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">{transaction.platform}</p>
        </div>
      </div>
    </div>
  );
};