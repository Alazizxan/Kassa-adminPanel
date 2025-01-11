import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Users() {
  const [searchType, setSearchType] = useState('telegramId');
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [transaction, setTransactions] = useState<any>(null);

  const handleSearch = () => {
    const endpoint = searchType === 'telegramId' 
      ? `http://localhost:3000/api/user/${searchTerm}`
      : `http://localhost:3000/api/user/game/${searchTerm}`;
      
    fetch(endpoint)
      .then(res => res.json())
      .then(data => setUserData(data));
      
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex space-x-2">
          <Select
            value={searchType}
            onValueChange={setSearchType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="telegramId">Telegram ID</SelectItem>
              <SelectItem value="gameId">Game ID</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={`Search by ${searchType === 'telegramId' ? 'Telegram ID' : 'Game ID'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {userData && (
  <Card>
    <CardHeader>
      <CardTitle>{userData.user.fullName}</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Foydalanuvchi ma'lumotlari */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Username</p>
          <p className="text-lg font-semibold">{userData.user.username}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Telegram ID</p>
          <p className="text-lg font-semibold">{userData.user.telegramId}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="text-lg font-semibold">{userData.user.phone}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Registration Date</p>
          <p className="text-lg font-semibold">
            {new Date(userData.user.registrationDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Active</p>
          <p className="text-lg font-semibold">
            {new Date(userData.user.lastActive).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-lg font-semibold">
            {userData.user.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        {userData.user.refferalId && (
          <div>
            <p className="text-sm text-muted-foreground">Referral ID</p>
            <p className="text-lg font-semibold">{userData.user.refferalId}</p>
          </div>
        )}
      </div>

      {/* Tranzaksiyalar bo'limi */}
      <div className='bg-black'>
        <h2 className="text-xl font-bold mb-4">Transactions</h2>
        <div className="grid grid-cols-1 gap-4">
          {userData.transactions && userData.transactions.length > 0 ? (
            userData.transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="border p-4 rounded-lg shadow-sm bg-black"
              >
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="text-lg font-semibold capitalize">
                  {transaction.type}
                </p>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="text-lg font-semibold">{transaction.platform}</p>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p
                  className={`text-lg font-semibold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount}
                </p>
                <p className="text-sm text-muted-foreground">Game Id</p>
                <p className="text-lg font-semibold">{transaction.userId}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.paymentId ? "Payment ID" : "Operation ID"}
                </p>
                <p className="text-lg font-semibold">
                  {transaction.paymentId || transaction.operationId}
                </p>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">
                  {new Date(transaction.timestamp).toLocaleDateString()}{" "}
                  {new Date(transaction.timestamp).toLocaleTimeString()}
                </p>
                {transaction.status && (
                  <>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold capitalize">
                      {transaction.status}
                    </p>
                  </>
                )}
                {transaction.error && (
                  <>
                    <p className="text-sm text-muted-foreground">Error</p>
                    <p className="text-lg font-semibold text-red-600">
                      {transaction.error}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No transactions available.
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)}

    </div>
  );
}