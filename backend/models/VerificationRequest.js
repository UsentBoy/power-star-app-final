const mongoose = require('mongoose');

const VerificationRequestSchema = new mongoose.Schema({
  userTelegramId: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Bkash', 'Nagad', 'Rocket'], required: true },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VerificationRequest', VerificationRequestSchema);
