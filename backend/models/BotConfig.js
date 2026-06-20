const mongoose = require('mongoose');

const BotConfigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  reward: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BotConfig', BotConfigSchema);
