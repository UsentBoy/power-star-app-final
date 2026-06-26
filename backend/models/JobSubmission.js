const mongoose = require('mongoose');

const JobSubmissionSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' },
  userTelegramId: { type: String, required: true },
  submittedId: { type: String, required: true }, // The Email/ID submitted by the user
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  jobTitle: { type: String }, // Cache job title at submission
  rewardAmount: { type: Number }, // Cache reward amount at submission
  isReported: { type: Boolean, default: false },
  reportReason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobSubmission', JobSubmissionSchema);
