const mongoose = require('mongoose');
const { ROLES, USER_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, required: true, index: true },
    status: { type: String, enum: USER_STATUS, default: 'active', index: true },
    branch: { type: String, trim: true },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    branch: this.branch || null,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
