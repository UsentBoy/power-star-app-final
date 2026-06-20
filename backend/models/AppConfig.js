const mongoose = require('mongoose');

const AppConfigSchema = new mongoose.Schema({
  marketIsVisible: { type: Boolean, default: true },
  adsEnabled: { type: Boolean, default: false },
  monetagDirectLink: { type: String, default: '' },
  monetagReward: { type: Number, default: 0.1 }
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);
