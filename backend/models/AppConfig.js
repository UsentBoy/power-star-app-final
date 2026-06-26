const mongoose = require('mongoose');

const AppConfigSchema = new mongoose.Schema({
  marketIsVisible: { type: Boolean, default: true },
  adsEnabled: { type: Boolean, default: false },
  monetagDirectLink: { type: String, default: '' },
  monetagReward: { type: Number, default: 0.1 },
  marqueeNotice: { type: String, default: 'Assalamualaikum! Welcome to our App!' },
  verifyFee: { type: Number, default: 20 },
  level1Commission: { type: Number, default: 5 },
  level2Commission: { type: Number, default: 2 },
  level3Commission: { type: Number, default: 1 },
  level4Commission: { type: Number, default: 1 }
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);
