const mongoose = require('mongoose');

const EarningHistorySchema = new mongoose.Schema({
  userTelegramId: { type: String, required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true }, // e.g., 'referral', 'job', 'task', 'admin', 'fund'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EarningHistory', EarningHistorySchema);
