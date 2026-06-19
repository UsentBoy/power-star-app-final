const mongoose = require('mongoose');

const AppConfigSchema = new mongoose.Schema({
  marketIsVisible: { type: Boolean, default: true }
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);
