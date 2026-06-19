const mongoose = require('mongoose');

const ContactConfigSchema = new mongoose.Schema({
  supportLink: { type: String, default: 'https://t.me/admin_support' },
  telegramChannel: { type: String, default: 'https://t.me/your_channel' },
  youtubeChannel: { type: String, default: 'https://youtube.com/c/your_channel' },
  bkashNumber: { type: String, default: '01700000000' },
  nagadNumber: { type: String, default: '01700000000' },
  rocketNumber: { type: String, default: '01700000000' },
  activationFee: { type: Number, default: 20 }
});

module.exports = mongoose.model('ContactConfig', ContactConfigSchema);
