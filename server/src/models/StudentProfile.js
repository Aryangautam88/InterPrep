const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    onboardingCompleted: { type: Boolean, default: false },
    college: { type: String, trim: true, default: '' },
    degree: { type: String, trim: true, default: 'B.Tech' },
    branch: { type: String, trim: true, default: '' },
    graduationYear: { type: Number },
    skills: [{ type: String, trim: true }],
    currentLevel: { type: String, default: 'beginner' },
    targetRole: { type: String, default: '' },
    targetCompanies: [{ type: String, trim: true }],
    preferredAreas: [{ type: String, trim: true }],
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    readinessSnapshot: {
      overall: { type: Number, default: 0 },
      computedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
