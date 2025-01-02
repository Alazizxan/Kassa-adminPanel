import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-6 bg-red-500/10 rounded-lg flex flex-col items-center justify-center gap-4">
      <AlertCircle className="text-red-500 w-12 h-12" />
      <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
      <p className="text-gray-400 text-center">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};