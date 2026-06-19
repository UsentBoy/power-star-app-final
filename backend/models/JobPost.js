const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Facebook TikTok Like Follow"
  description: { type: String, required: true },
  link: { type: String, required: true }, // The link for the work
  amount: { type: Number, required: true }, // Reward amount for completing the work
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobPost', JobPostSchema);
