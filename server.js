// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PaymentAPIClient = require('./SpinPay');

// Connect to MongoDB
mongoose.connect(DATABASE.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(express.json());

// Define Schemas
const UserSchema = new mongoose.Schema({
  telegramId: String,
  username: String,
  fullName: String,
  phone: String,
  registrationDate: { type: Date, default: Date.now },
  lastActive: Date,
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
});

const TransactionSchema = new mongoose.Schema({
  userId: String,
  telegramId: String,
  phone: String,
  type: { type: String, enum: ['deposit', 'withdrawal'] },
  platform: String,
  gameId: String,
  cardNumber: String,
  expiryDate: String,
  amount: Number,
  status: String,
  paymentId: String,
  error: String,
  operationId: String,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// API Routes

// Get transactions by Game ID
app.get('/api/transactions/game/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const transactions = await Transaction.find({ gameId });

    const totals = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'deposit') {
        acc.totalDeposit += transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        acc.totalWithdrawal += transaction.amount;
      }
      return acc;
    }, { totalDeposit: 0, totalWithdrawal: 0 });

    res.json({ transactions, totals });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching transactions');
  }
});

// Get user details by Telegram ID
app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const telegramId = req.params.telegramId;
    const user = await User.findOne({ telegramId });
    const transactions = await Transaction.find({ telegramId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ user, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user data');
  }
});

// Get total transaction amounts
app.get('/api/transaction-totals', async (req, res) => {
  try {
    const deposits = await Transaction.aggregate([
      { $match: { type: 'deposit' } },
      { $group: { _id: null, totalDeposit: { $sum: '$amount' } } },
    ]);

    const withdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal' } },
      { $group: { _id: null, totalWithdrawal: { $sum: '$amount' } } },
    ]);

    const totals = {
      totalDeposit: deposits[0]?.totalDeposit || 0,
      totalWithdrawal: withdrawals[0]?.totalWithdrawal || 0,
    };

    res.json(totals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching totals');
  }
});

// Get month-total transactions
app.get('/api/transactions/month-total', async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).send('Year and month are required');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'deposit') {
          acc.totalDeposit += transaction.amount;
        } else if (transaction.type === 'withdrawal') {
          acc.totalWithdrawal += transaction.amount;
        }
        return acc;
      },
      { totalDeposit: 0, totalWithdrawal: 0 }
    );

    res.json({ totals, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error calculating month totals');
  }
});





// Deposit route
app.post('/api/transactions/deposit', async (req, res) => {
  const { userId, amount} = req.body;

  try {
    const client = new PaymentAPIClient();
    const response = await client.deposit(userId, amount);
    


    if (response.success) {
      const transaction = new Transaction({
        userId,
        type: 'deposit',
        platform: 'spinbetter',
        gameId: userId,
        cardNumber: '',
        expiryDate:'',
        amount,
        status: 'completed',
        operationId: response.operationId,
      });
      await transaction.save();
      res.json({ success: true, transaction });
    } else {
      res.status(400).json({ success: false, message: response.Message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing deposit');
  }
});

// Payout route
app.post('/api/transactions/payout', async (req, res) => {
  const { userId, amount} = req.body;

  try {
    const client = new PaymentAPIClient();
    const response = await client.payout(userId, amount);

    if (response.success) {
      const transaction = new Transaction({
        userId,
        type: 'withdrawal',
        platform: 'spinbetter',
        gameId: userId,
        cardNumber: '',
        expiryDate:'',
        amount,
        status: 'completed',
        operationId: response.operationId,
      });
      await transaction.save();
      res.json({ success: true, transaction });
    } else {
      res.status(400).json({ success: false, message: response.Message });
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing payout');
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
