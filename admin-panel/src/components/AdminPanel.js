import React, { useState } from 'react';
import axios from 'axios';


function AdminPanel() {
  const [gameId, setGameId] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [totals, setTotals] = useState(null);

  const handleGameIdSubmit = async () => {
    const response = await axios.get(`/api/transactions/game/${gameId}`);
    setTransactionData(response.data);
  };

  const handleTelegramIdSubmit = async () => {
    const response = await axios.get(`/api/user/${telegramId}`);
    setUserData(response.data);
  };

  const handleTotals = async () => {
    const response = await axios.get('/api/transaction-totals');
    setTotals(response.data);
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      
      <div>
        <h2>Transaction Check by Game ID</h2>
        <input 
          type="text" 
          value={gameId} 
          onChange={(e) => setGameId(e.target.value)} 
          placeholder="Enter Game ID"
        />
        <button onClick={handleGameIdSubmit}>Check Transactions</button>
        {transactionData && (
          <div>
            <p>Game ID: {transactionData.gameId}</p>
            <p>Total Deposit: {transactionData.totalDeposit}</p>
            <p>Total Withdrawal: {transactionData.totalWithdrawal}</p>
          </div>
        )}
      </div>
      
      <div>
        <h2>User History by Telegram ID</h2>
        <input 
          type="text" 
          value={telegramId} 
          onChange={(e) => setTelegramId(e.target.value)} 
          placeholder="Enter Telegram ID"
        />
        <button onClick={handleTelegramIdSubmit}>Check User</button>
        {userData && (
          <div>
            <p>Name: {userData.user.fullName}</p>
            <p>Phone: {userData.user.phone}</p>
            <p>Last Active: {userData.user.lastActive}</p>
            <p>Transactions:</p>
            {userData.transactions.map(t => (
              <div key={t._id}>
                <p>Type: {t.type}, Amount: {t.amount}, Status: {t.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2>Transaction Totals</h2>
        <button onClick={handleTotals}>Get Totals</button>
        {totals && (
          <div>
            <p>Total Deposit: {totals.totalDeposit}</p>
            <p>Total Withdrawal: {totals.totalWithdrawal}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
