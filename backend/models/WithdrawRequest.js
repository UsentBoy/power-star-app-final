const mongoose = require('mongoose');

const WithdrawRequestSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // e.g., Bkash, Nagad, Rocket
  accountNumber: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'rejected'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WithdrawRequest', WithdrawRequestSchema);
