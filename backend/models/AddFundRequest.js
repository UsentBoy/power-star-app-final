const mongoose = require('mongoose');

const AddFundRequestSchema = new mongoose.Schema({
  userId: String,
  username: String,
  amount: Number,
  paymentMethod: String,
  senderNumber: String,
  transactionId: String,
  status: { type: String, default: 'Pending' }, // Pending, Accepted, Rejected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AddFundRequest', AddFundRequestSchema);
