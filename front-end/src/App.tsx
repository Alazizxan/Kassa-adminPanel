import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import AllTransactions from '@/pages/AllTransactions';
import Users from '@/pages/Users';
import AllUsers from '@/pages/AllUsers';
import Deposit from '@/pages/Deposit';
import Withdrawal from '@/pages/Withdrawal';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/all-transactions" element={<AllTransactions />} />
              <Route path="/users" element={<Users />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdrawal" element={<Withdrawal />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;