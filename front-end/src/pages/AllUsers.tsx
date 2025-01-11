import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">All Users</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user: any) => (
          <Card key={user._id} className="p-4">
            <CardHeader>
              <CardTitle>{user.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-lg font-semibold">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telegram ID</p>
                  <p className="text-lg font-semibold">{user.telegramId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">phone</p>
                  <p className="text-lg font-semibold">
                    {user.phone}
                  </p>
                </div>
                {user.refferalId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Referral ID</p>
                    <p className="text-lg font-semibold">{user.refferalId}</p>
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
