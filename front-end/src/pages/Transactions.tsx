import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Transactions() {
  const [searchType, setSearchType] = useState('operationId');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleSearch = () => {
    const queryParam = searchType === 'operationId' ? 'operationId' : 'paymentId';
    fetch(`http://localhost:3000/transactions/search?${queryParam}=${searchTerm}`)
      .then(res => res.json())
      .then(data => setTransactions(data.data || []));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex space-x-2">
          <Select
            value={searchType}
            onValueChange={setSearchType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operationId">Operation ID</SelectItem>
              <SelectItem value="paymentId">Payment ID</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={`Search by ${searchType === 'operationId' ? 'Operation ID' : 'Payment ID'}`}
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

      <div className="grid gap-4">
        {transactions.map((transaction: any) => (
          <Card key={transaction._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} - 
                {transaction.platform}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">${Math.abs(transaction.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-lg font-semibold">{transaction.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telegram ID</p>
                  <p className="text-lg font-semibold">{transaction.telegramId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Card Number</p>
                  <p className="text-lg font-semibold">{transaction.cardNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operation ID</p>
                  <p className="text-lg font-semibold">{transaction.operationId}</p>
                </div>
                {transaction.paymentId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="text-lg font-semibold">{transaction.paymentId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {transaction.status && (
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold">{transaction.status}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}