import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Withdrawal() {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    platform: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/transactions/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Withdrawal successful');
        setFormData({ userId: '', amount: '', platform: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error processing withdrawal');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Make a Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User ID</label>
              <Input
                required
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="Enter User ID"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                required
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spinbetter">Spinbetter</SelectItem>
                  <SelectItem value="jvspinbet">JVSpinbet</SelectItem>
                  <SelectItem value="probet">Probet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Process Withdrawal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}