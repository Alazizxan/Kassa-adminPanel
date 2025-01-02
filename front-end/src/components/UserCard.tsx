import React from 'react';
import { User } from '../types';
import { Users as UsersIcon, Calendar, Phone } from 'lucide-react';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
    <div className="flex items-center gap-3 sm:gap-4 mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
        <UsersIcon className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white">{user.fullName}</h3>
        <p className="text-sm text-gray-400">@{user.username}</p>
      </div>
    </div>
    
    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
      <div className="flex items-center gap-2 text-gray-400">
        <Calendar size={16} />
        <span>Joined: {new Date(user.registrationDate).toLocaleDateString()}</span>
      </div>
      {user.phone && (
        <div className="flex items-center gap-2 text-gray-400">
          <Phone size={16} />
          <span>{user.phone}</span>
        </div>
      )}
      {user.telegramId && (
        <div className="flex items-center gap-2 text-gray-400">
          <Telegram size={16} />
          <span>{user.telegramId}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
        {user.isAdmin && (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500">
            Admin
          </span>
        )}
      </div>
    </div>
  </div>
);