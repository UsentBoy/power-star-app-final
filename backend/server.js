require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onlineearnapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 1500
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const TaskConfig = require('./models/TaskConfig');
const User = require('./models/User');
const CoinRequest = require('./models/CoinRequest');
const CoinConfig = require('./models/CoinConfig');
const AddFundRequest = require('./models/AddFundRequest');
const JobSubmission = require('./models/JobSubmission');
const JobPost = require('./models/JobPost');
const BotConfig = require('./models/BotConfig');
const VerificationRequest = require('./models/VerificationRequest');
const ContactConfig = require('./models/ContactConfig');
const WithdrawRequest = require('./models/WithdrawRequest');
const AppConfig = require('./models/AppConfig');

// Initialize Telegram Bot with Webhook for Render
try { 
  const bot = require('./bot'); 
  const domain = process.env.RENDER_EXTERNAL_URL;
  
  if (domain) {
    app.use(bot.webhookCallback('/telegraf-webhook'));
    bot.telegram.setWebhook(`${domain}/telegraf-webhook`)
      .then(() => console.log(`Telegram Webhook set up successfully at ${domain}`));
  } else {
    bot.launch({ dropPendingUpdates: true })
      .then(() => console.log('Telegram Bot running via Long Polling (Local)...'));
  }
} catch(e) { 
  console.error('Bot failed to load:', e.message); 
}

// --- User Registration/Mock Login ---
app.post('/api/user/login', async (req, res) => {
  const { telegramId, referredBy } = req.body;
  try {
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ 
        telegramId, 
        referredBy,
        isAdmin: telegramId === (process.env.MASTER_ADMIN_UID || '6323700179') // Force master admin
      });
      await user.save();
    } else if (telegramId === (process.env.MASTER_ADMIN_UID || '6323700179') && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Verification & 4-Gen MLM ---
app.post('/api/verify/submit', async (req, res) => {
  const { userTelegramId, paymentMethod, transactionId } = req.body;
  try {
    const reqData = new VerificationRequest({ userTelegramId, paymentMethod, transactionId });
    await reqData.save();
    res.json({ success: true, message: 'Verification pending approval' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/verify/approve', async (req, res) => {
  const { requestId } = req.body;
  try {
    const request = await VerificationRequest.findById(requestId);
    if (!request || request.status !== 'pending') return res.status(400).json({ error: 'Invalid request' });

    request.status = 'approved';
    await request.save();

    const user = await User.findOne({ telegramId: request.userTelegramId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.isVerified = true;
    await user.save();

    // 4-Generation MLM Distribution
    const levels = [5, 2, 1, 1];
    let currentReferrerId = user.referredBy;

    for (let i = 0; i < levels.length; i++) {
      if (!currentReferrerId) break;
      const referrer = await User.findOne({ telegramId: currentReferrerId });
      if (!referrer) break;
      
      referrer.balance += levels[i];
      await referrer.save();
      
      currentReferrerId = referrer.referredBy; // move up the tree
    }

    res.json({ success: true, message: 'User verified and bonuses distributed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User's Referral Stats
app.get('/api/referrals/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find direct referrals (1st generation)
    const directReferrals = await User.find({ referredBy: req.params.telegramId }, 'username isVerified createdAt');
    const verifiedCount = directReferrals.filter(r => r.isVerified).length;

    res.json({
      totalReferrals: verifiedCount,
      totalEarned: user.balance, // assuming balance is mostly referral earnings for now
      referrals: directReferrals
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Job Post System ---
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await JobPost.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/jobs/create', async (req, res) => {
  const { title, description, link, amount, postedBy } = req.body;
  try {
    const job = new JobPost({ title, description, link, amount, postedBy: postedBy || 'admin' });
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/jobs/user/:userId', async (req, res) => {
  try {
    const jobs = await JobPost.find({ postedBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/jobs/:id/toggle-active', async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    job.isActive = !job.isActive;
    await job.save();
    res.json({ success: true, isActive: job.isActive });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/jobs/:id/delete', async (req, res) => {
  try {
    await JobPost.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/jobs/submit', async (req, res) => {
  const { jobId, userTelegramId, submittedId } = req.body;
  try {
    const sub = new JobSubmission({ jobId, userTelegramId, submittedId });
    await sub.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/job-submissions', async (req, res) => {
  try {
    const submissions = await JobSubmission.find().populate('jobId').sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/jobs/approve', async (req, res) => {
  const { submissionId } = req.body;
  try {
    const sub = await JobSubmission.findById(submissionId).populate('jobId');
    if (!sub || sub.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or processed submission' });
    }
    sub.status = 'approved';
    await sub.save();
    
    const user = await User.findOne({ telegramId: sub.userTelegramId });
    if (user && sub.jobId) {
      user.balance += sub.jobId.amount;
      await user.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/jobs/reject', async (req, res) => {
  const { submissionId } = req.body;
  try {
    const sub = await JobSubmission.findById(submissionId);
    if (!sub || sub.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or processed submission' });
    }
    sub.status = 'rejected';
    await sub.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Telegram Bots (Sudden Income) ---
app.get('/api/bots', async (req, res) => {
  try {
    const bots = await BotConfig.find({ isActive: true }).limit(5);
    res.json(bots);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/bots', async (req, res) => {
  try {
    const bots = await BotConfig.find().sort({ createdAt: -1 });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/bots/save', async (req, res) => {
  const { id, title, description, link, isActive } = req.body;
  try {
    if (id) {
      const bot = await BotConfig.findByIdAndUpdate(id, { title, description, link, isActive }, { new: true });
      res.json({ success: true, bot });
    } else {
      const bot = new BotConfig({ title, description, link, isActive: isActive !== false });
      await bot.save();
      res.json({ success: true, bot });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/bots/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await BotConfig.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Contact Config APIs ---
app.get('/api/contact', async (req, res) => {
  try {
    let config = await ContactConfig.findOne();
    if (!config) {
      config = new ContactConfig();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/contact', async (req, res) => {
  const { supportLink, telegramChannel, youtubeChannel, bkashNumber, nagadNumber, rocketNumber } = req.body;
  try {
    let config = await ContactConfig.findOne();
    if (!config) config = new ContactConfig();
    config.supportLink = supportLink;
    config.telegramChannel = telegramChannel;
    config.youtubeChannel = youtubeChannel;
    if (bkashNumber) config.bkashNumber = bkashNumber;
    if (nagadNumber) config.nagadNumber = nagadNumber;
    if (rocketNumber) config.rocketNumber = rocketNumber;
    await config.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Admin Management APIs ---
app.post('/api/admin/add', async (req, res) => {
  const { newAdminId } = req.body;
  try {
    let user = await User.findOne({ telegramId: newAdminId });
    if (user) {
      user.isAdmin = true;
      await user.save();
      res.json({ success: true, message: 'Admin added' });
    } else {
      res.status(404).json({ error: 'User not found in system. They must login first.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/remove', async (req, res) => {
  const { removeAdminId } = req.body;
  try {
    if (removeAdminId === (process.env.MASTER_ADMIN_UID || '6323700179')) return res.status(400).json({ error: 'Cannot remove master admin' });
    let user = await User.findOne({ telegramId: removeAdminId });
    if (user) {
      user.isAdmin = false;
      await user.save();
    }
    res.json({ success: true, message: 'Admin removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/user/:id/manual-verify', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
    
    user.isVerified = true;
    await user.save();

    // 4-Generation MLM Distribution
    const levels = [5, 2, 1, 1];
    let currentReferrerId = user.referredBy;

    for (let i = 0; i < levels.length; i++) {
      if (!currentReferrerId) break;
      const referrer = await User.findOne({ telegramId: currentReferrerId });
      if (!referrer) break;
      
      referrer.balance += levels[i];
      await referrer.save();
      
      currentReferrerId = referrer.referredBy; // move up the tree
    }

    res.json({ success: true, message: 'User manually verified and bonuses distributed', isVerified: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Coin Selling API ---
app.post('/api/coin/sell', async (req, res) => {
  try {
    const { userId, username, coinType, amount, paymentMethod, paymentNumber, senderDetails, couponCode } = req.body;
    const newReq = new CoinRequest({ userId, username, coinType, amount, paymentMethod, paymentNumber, senderDetails, couponCode });
    await newReq.save();
    res.json({ message: 'Coin sell request submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/coin/history/:userId', async (req, res) => {
  try {
    const history = await CoinRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/history/:userId', async (req, res) => {
  try {
    const history = await JobSubmission.find({ userTelegramId: req.params.userId }).populate('jobId').sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/coin-requests', async (req, res) => {
  try {
    const requests = await CoinRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/coin-requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await CoinRequest.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Coin request status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Add Fund API ---
app.post('/api/fund/add', async (req, res) => {
  try {
    const { userId, username, amount, paymentMethod, senderNumber, transactionId } = req.body;
    const newReq = new AddFundRequest({ userId, username, amount, paymentMethod, senderNumber, transactionId });
    await newReq.save();
    res.json({ message: 'Add fund request submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/fund-requests', async (req, res) => {
  try {
    const requests = await AddFundRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/fund-requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const request = await AddFundRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    if (status === 'Accepted' && request.status !== 'Accepted') {
      const user = await User.findOne({ telegramId: request.userId });
      if (user) {
        user.balance += request.amount;
        await user.save();
      }
    }
    
    request.status = status;
    await request.save();
    res.json({ message: `Fund request ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Coin Config API ---
app.get('/api/coins', async (req, res) => {
  const defaults = [
    { coinId: 'niva', label: 'Niva Coin', price: 5, targetUser: '@NivaCoinAdminOfficial', color: '#2563eb', minAmount: 1000, isActive: true, isVisible: true },
    { coinId: 'topfollower', label: 'Topfollower', price: 9, targetUser: '@TopfollowerAdmin', color: '#0ea5e9', minAmount: 1000, isActive: true, isVisible: true },
    { coinId: 'ns', label: 'Ns Coin', price: 8, targetUser: '@NsCoinAdmin', color: '#0d9488', minAmount: 1000, isActive: true, isVisible: true },
    { coinId: 'smartsocial', label: 'Smart Social', price: 12, targetUser: 'admin@smartsocial.com', color: '#8b5cf6', minAmount: 1000, isActive: true, isVisible: true },
    { coinId: 'topfollows', label: 'Top follow', price: 10, targetUser: '@TopfollowsAdmin', color: '#f59e0b', minAmount: 1000, isActive: true, isVisible: true }
  ];
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB not connected");
    }
    let configs = await CoinConfig.find();
    if (configs.length === 0) {
      await CoinConfig.insertMany(defaults);
      configs = await CoinConfig.find();
    }
    res.json(configs);
  } catch (err) {
    // Fallback to defaults if MongoDB is disconnected so UI doesn't break
    res.json(defaults);
  }
});

app.post('/api/admin/coins', async (req, res) => {
  try {
    const { configs } = req.body;
    for (let conf of configs) {
      await CoinConfig.findOneAndUpdate({ coinId: conf.coinId }, conf, { upsert: true, new: true });
    }
    res.json({ message: 'Coin settings updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error();
    let conf = await AppConfig.findOne();
    if (!conf) {
      conf = new AppConfig();
      await conf.save();
    }
    res.json(conf);
  } catch (err) {
    res.json({ marketIsVisible: true });
  }
});

app.post('/api/admin/config', async (req, res) => {
  try {
    const { marketIsVisible } = req.body;
    let conf = await AppConfig.findOne();
    if (!conf) conf = new AppConfig();
    conf.marketIsVisible = marketIsVisible;
    await conf.save();
    res.json(conf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Admin Stats & Dashboard ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingVerifications = await VerificationRequest.countDocuments({ status: 'pending' });
    const pendingWithdraws = await WithdrawRequest.countDocuments({ status: 'pending' });
    
    // Also send pending items
    const verifications = await VerificationRequest.find({ status: 'pending' });
    const withdraws = await WithdrawRequest.find({ status: 'pending' });
    res.json({ totalUsers, pendingVerifications, pendingWithdraws, verifications, withdraws });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Admin User Search & Manage ---
app.get('/api/admin/user/:identifier', async (req, res) => {
  try {
    const id = req.params.identifier;
    // Remove @ if admin typed @username
    const cleanId = id.startsWith('@') ? id.slice(1) : id;
    
    let user = await User.findOne({ 
      $or: [{ telegramId: cleanId }, { username: cleanId }] 
    });
    
    // Auto-promote master admin if they fetch their own profile
    const masterAdminId = process.env.MASTER_ADMIN_UID || '6323700179';
    if (user && user.telegramId === masterAdminId && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/user/:telegramId/balance', async (req, res) => {
  const { amount, action } = req.body; // action: 'add' or 'cut'
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (action === 'add') user.balance += Number(amount);
    if (action === 'cut') user.balance -= Number(amount);
    await user.save();
    res.json({ success: true, balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/user/:telegramId/ban', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.isBanned = !user.isBanned; // Toggle ban status
    await user.save();
    res.json({ success: true, isBanned: user.isBanned });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Withdraw System ---
app.post('/api/withdraw/submit', async (req, res) => {
  const { telegramId, amount, method, accountNumber } = req.body;
  try {
    const user = await User.findOne({ telegramId });
    if (!user || user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });
    
    user.balance -= amount;
    await user.save();
    
    const reqData = new WithdrawRequest({ telegramId, amount, method, accountNumber });
    await reqData.save();
    res.json({ success: true, message: 'Withdraw request submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/withdraw/approve', async (req, res) => {
  const { id } = req.body;
  try {
    const reqData = await WithdrawRequest.findById(id);
    if (!reqData) return res.status(404).json({ error: 'Not found' });
    reqData.status = 'paid';
    await reqData.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Dynamic Task Config ---
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await TaskConfig.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/tasks', async (req, res) => {
  const { taskId, title, accountVideo, workVideo, withdrawVideo, regLink } = req.body;
  try {
    let task = await TaskConfig.findOne({ taskId });
    if (!task) task = new TaskConfig({ taskId });
    task.title = title || task.title;
    task.accountVideo = accountVideo !== undefined ? accountVideo : task.accountVideo;
    task.workVideo = workVideo !== undefined ? workVideo : task.workVideo;
    task.withdrawVideo = withdrawVideo !== undefined ? withdrawVideo : task.withdrawVideo;
    task.regLink = regLink !== undefined ? regLink : task.regLink;
    await task.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Basic check
app.get('/', (req, res) => {
  res.send('Online Earn App Backend API Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
