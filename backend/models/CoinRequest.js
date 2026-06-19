const mongoose = require('mongoose');

const CoinRequestSchema = new mongoose.Schema({
  userId: String,
  username: String,
  coinType: String,
  amount: Number,
  paymentMethod: String,
  paymentNumber: String,
  senderDetails: String, // ID or username from which the user sent the coins
  couponCode: { type: String, default: '' }, // For Topfollower coupon codes
  status: { type: String, default: 'Pending' }, // Pending, Accepted, Rejected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoinRequest', CoinRequestSchema);
