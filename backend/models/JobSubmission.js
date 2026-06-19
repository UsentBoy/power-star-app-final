const mongoose = require('mongoose');

const JobSubmissionSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  userTelegramId: { type: String, required: true },
  submittedId: { type: String, required: true }, // The Email/ID submitted by the user
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobSubmission', JobSubmissionSchema);
