const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  firstName: { type: String, default: '' },
  username: { type: String, default: '' },
  balance: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false }, // Verification status
  isAdmin: { type: Boolean, default: false }, // Admin status
  isMasterAdmin: { type: Boolean, default: false }, // Master Admin status
  isBanned: { type: Boolean, default: false }, // Banned status
  referredBy: { type: String, default: null }, // Telegram ID of the referrer
  completedTasks: [{ type: Number }], // Array of taskIds completed by user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
