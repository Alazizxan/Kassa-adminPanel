import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [platform, setPlatform] = useState('all');

  useEffect(() => {
    // Fetch all transactions for the current month
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    fetch(`http://localhost:3000/api/transactions/month-total?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []));
  }, []);

  const filteredTransactions = platform === 'all'
    ? transactions
    : transactions.filter((t: any) => t.platform.toLowerCase() === platform.toLowerCase());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Transactions</h1>
        <Select
          value={platform}
          onValueChange={setPlatform}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="spinbetter">Spinbetter</SelectItem>
            <SelectItem value="jvspinbet">JVSpinbet</SelectItem>
            <SelectItem value="probet">Probet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTransactions.map((transaction: any) => (
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
                    {new Date(transaction.timestamp).toLocaleDateString()}{" "}
                    {new Date(transaction.timestamp).toLocaleTimeString()}
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