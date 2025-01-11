import { Link } from 'react-router-dom';
import { CircleDollarSign, Users, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <CircleDollarSign className="h-6 w-6" />
              <span className="text-lg font-bold">Admin Panel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link to="/transactions">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <CircleDollarSign className="h-4 w-4" />
                  <span>Transactions</span>
                </Button>
              </Link>
              <Link to="/all-transactions">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <span>All Transactions</span>
                </Button>
              </Link>
              <Link to="/users">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </Button>
              </Link>
              <Link to="/all-users">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>All Users</span>
                </Button>
              </Link>
              <Link to="/deposit">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowDownToLine className="h-4 w-4" />
                  <span>Deposit</span>
                </Button>
              </Link>
              <Link to="/withdrawal">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowUpFromLine className="h-4 w-4" />
                  <span>Withdrawal</span>
                </Button>
              </Link>
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}