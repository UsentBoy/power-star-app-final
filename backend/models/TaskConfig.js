const mongoose = require('mongoose');

const TaskConfigSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true }, // e.g., 'tiktok', 'typing-job'
  title: { type: String, required: true },
  accountVideo: { type: String, default: '' },
  workVideo: { type: String, default: '' },
  withdrawVideo: { type: String, default: '' },
  regLink: { type: String, default: '' }
});

module.exports = mongoose.model('TaskConfig', TaskConfigSchema);
