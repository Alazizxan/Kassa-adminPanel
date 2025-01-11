// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PaymentAPIClient = require('./SpinPay');
const config = require('./config');
const jvspinClient = require('./jvspinbetpay');
const probetClient = require('./1probet-pay');

// Connect to MongoDB
mongoose.connect(config.DATABASE.URI, {
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
    const userId = req.params.gameId;
    const transactions = await Transaction.find({ userId });
    const telegramId = transactions[0].telegramId;

    // Foydalanuvchini topish
    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'User not found for the given telegramId' });
    }

    const totals = transactions.reduce((acc, transaction) => {
      // Miqdorni musbat qilib olish va null bo'lsa 0 ga aylantirish
      const amount = Math.abs(transaction.amount || 0);



      if (transaction.type === 'deposit') {
        acc.totalDeposit += amount;
      } else if (transaction.type === 'withdrawal') {
        acc.totalWithdrawal += amount;
      }
      return acc;
    }, { totalDeposit: 0, totalWithdrawal: 0 });

    res.json({ transactions, totals,user });
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
  const { userId, amount, platform } = req.body;

  try {
    let client;

    // Platformga qarab mos client tanlanadi
    switch (platform) {
      case 'spinbetter':
        client = new PaymentAPIClient();
        break;
      case 'jvspinbet':
        client = new jvspinClient();
        break;
      case 'probet':
        client = new probetClient();
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid platform' });
    }

    const response = await client.deposit(userId, amount);

    if (response.success) {
      const transaction = new Transaction({
        userId,
        type: 'deposit',
        platform,
        gameId: userId,
        cardNumber: '',
        expiryDate: '',
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
  const { userId, amount, platform } = req.body;

  try {
    let client;

    // Platformga qarab mos client tanlanadi
    switch (platform) {
      case 'spinbetter':
        client = new PaymentAPIClient();
        break;
      case 'jvspinbet':
        client = new jvspinClient();
        break;
      case 'probet':
        client = new probetClient();
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid platform' });
    }

    const response = await client.payout(userId, amount);

    if (response.success) {
      const transaction = new Transaction({
        userId,
        type: 'withdrawal',
        platform,
        gameId: userId,
        cardNumber: 'admin',
        expiryDate: '',
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


app.get('/api/users', async (req, res) => {
  try {
    // Barcha foydalanuvchilarni bazadan olish
    const users = await User.find({});
    
    // JSON formatida qaytarish
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users');
  }
});




const findTransactionById = async (paymentId, operationId) => {
  try {
    // Qidirish mezonini shakllantirish
    const query = {};
    if (paymentId) {
      query.paymentId = paymentId;
    }
    if (operationId) {
      query.operationId = operationId;
    }

    // Tranzaksiyalarni qidirish
    const transactions = await Transaction.find(query);

    // Agar tranzaksiyalar topilsa
    if (transactions.length > 0) {
      return {
        success: true,
        message: 'Tranzaksiyalar topildi',
        data: transactions,
      };
    }

    // Agar hech narsa topilmasa
    return {
      success: false,
      message: 'Tranzaksiyalar topilmadi',
    };
  } catch (error) {
    // Xato yuzaga kelsa
    return {
      success: false,
      message: 'Xatolik yuz berdi',
      error: error.message,
    };
  }
};

// PaymentID yoki OperationID orqali tranzaksiyalarni qidirish endpointi
app.get('/transactions/search', async (req, res) => {
  const { paymentId, operationId } = req.query;

  const result = await findTransactionById(paymentId, operationId);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
});





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
