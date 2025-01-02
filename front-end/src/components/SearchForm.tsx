import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (type: 'telegram' | 'game', id: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchId, setSearchId] = useState('');
  const [searchType, setSearchType] = useState<'telegram' | 'game'>('telegram');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      onSearch(searchType, searchId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-gray-800 p-4 rounded-lg w-full max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Search Type</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'telegram' | 'game')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="telegram">Telegram ID</option>
              <option value="game">Game ID</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">ID</label>
            <div className="relative">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={`Enter ${searchType === 'telegram' ? 'Telegram' : 'Game'} ID`}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-3 pr-12 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 bg-gray-700 rounded-md"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};