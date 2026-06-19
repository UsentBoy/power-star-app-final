const mongoose = require('mongoose');

const CoinConfigSchema = new mongoose.Schema({
  coinId: { type: String, required: true, unique: true },
  label: String,
  price: Number,
  targetUser: String,
  color: String,
  minAmount: { type: Number, default: 1000 },
  isActive: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  tutorialVideo: { type: String, default: '' }
});

module.exports = mongoose.model('CoinConfig', CoinConfigSchema);
