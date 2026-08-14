const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const MentorProfile = require('../models/MentorProfile');
const RefreshToken = require('../models/RefreshToken');
const { AppError } = require('../utils/apiResponse');
const { generateRefreshToken, hashToken } = require('../utils/tokens');
const env = require('../config/env');

const REFRESH_COOKIE = 'refreshToken';
const SALT_ROUNDS = 12;

function accessTokenFor(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpires }
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? 'none' : 'lax',
    path: '/api/auth',
    maxAge: env.refreshTokenDays * 24 * 60 * 60 * 1000,
  };
}

async function persistRefreshToken(userId) {
  const token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + env.refreshTokenDays * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });
  return token;
}

async function attachSession(res, user, { issueRefresh = true } = {}) {
  const accessToken = accessTokenFor(user);
  if (issueRefresh) {
    const refreshToken = await persistRefreshToken(user._id);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  }
  return { accessToken, user: user.toSafeJSON() };
}

async function register({ name, email, password, branch, role }) {
  if (role === 'admin') {
    throw new AppError('Admin accounts cannot be registered publicly', 403, 'FORBIDDEN');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'CONFLICT');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const isMentor = role === 'mentor';

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    status: isMentor ? 'pending' : 'active',
    branch: branch || '',
  });

  if (role === 'student') {
    await StudentProfile.create({
      userId: user._id,
      branch: branch || '',
      onboardingCompleted: false,
    });
  }

  if (isMentor) {
    await MentorProfile.create({
      userId: user._id,
      approvalStatus: 'pending',
    });
    return {
      pendingApproval: true,
      user: user.toSafeJSON(),
      message: 'Mentor account created. An admin must approve your profile before you can sign in.',
    };
  }

  return { pendingApproval: false, user };
}

async function assertCanLogin(user) {
  if (user.status === 'inactive') {
    throw new AppError('This account has been deactivated', 403, 'FORBIDDEN');
  }

  if (user.role === 'mentor') {
    const profile = await MentorProfile.findOne({ userId: user._id });
    if (!profile || profile.approvalStatus === 'pending' || user.status === 'pending') {
      throw new AppError(
        'Your mentor account is awaiting admin approval',
        403,
        'MENTOR_PENDING'
      );
    }
    if (profile.approvalStatus === 'rejected') {
      throw new AppError('Your mentor application was not approved', 403, 'MENTOR_REJECTED');
    }
  }
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  await assertCanLogin(user);
  return user;
}

async function refresh(rawToken) {
  if (!rawToken) {
    throw new AppError('Refresh token missing', 401, 'UNAUTHORIZED');
  }

  const record = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });
  if (!record || record.expiresAt < new Date()) {
    throw new AppError('Session expired', 401, 'UNAUTHORIZED');
  }

  const user = await User.findById(record.userId);
  if (!user) {
    await record.deleteOne();
    throw new AppError('Session expired', 401, 'UNAUTHORIZED');
  }

  await assertCanLogin(user);
  return user;
}

async function logout(rawToken, userId) {
  if (rawToken) {
    await RefreshToken.deleteOne({ tokenHash: hashToken(rawToken) });
  } else if (userId) {
    await RefreshToken.deleteMany({ userId });
  }
}

async function logoutAll(userId) {
  await RefreshToken.deleteMany({ userId });
  await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+passwordHash');
  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    throw new AppError('Current password is incorrect', 400, 'VALIDATION_ERROR');
  }
  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.tokenVersion += 1;
  await user.save();
  await RefreshToken.deleteMany({ userId });
}

async function getMe(user) {
  const safe = user.toSafeJSON();
  if (user.role === 'student') {
    const profile = await StudentProfile.findOne({ userId: user._id }).lean();
    safe.profile = profile
      ? {
          onboardingCompleted: profile.onboardingCompleted,
          branch: profile.branch,
          college: profile.college,
          targetRole: profile.targetRole,
        }
      : null;
  }
  if (user.role === 'mentor') {
    const profile = await MentorProfile.findOne({ userId: user._id }).lean();
    safe.profile = profile
      ? {
          approvalStatus: profile.approvalStatus,
          currentCompany: profile.currentCompany,
          jobTitle: profile.jobTitle,
        }
      : null;
  }
  return safe;
}

module.exports = {
  REFRESH_COOKIE,
  cookieOptions,
  attachSession,
  register,
  login,
  refresh,
  logout,
  logoutAll,
  changePassword,
  getMe,
};
