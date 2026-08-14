const mongoose = require('mongoose');
const { MENTOR_APPROVAL } = require('../utils/constants');

const mentorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: MENTOR_APPROVAL,
      default: 'pending',
      index: true,
    },
    currentCompany: { type: String, trim: true, default: '' },
    jobTitle: { type: String, trim: true, default: '' },
    experienceYears: { type: Number, default: 0 },
    skills: [{ type: String, trim: true }],
    bio: { type: String, default: '', maxlength: 2000 },
    avatarUrl: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    studentsHelped: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    avgResponseTimeHours: { type: Number, default: 0 },
    mentorScore: { type: Number, default: 0, index: true },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
