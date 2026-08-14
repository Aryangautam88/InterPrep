const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/apiResponse');
const env = require('../config/env');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    let payload;
    try {
      payload = jwt.verify(token, env.jwtAccessSecret);
    } catch {
      throw new AppError('Invalid or expired token', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(payload.sub);
    if (!user || user.status === 'inactive') {
      throw new AppError('Account is not available', 401, 'UNAUTHORIZED');
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AppError('Session expired', 401, 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticate };
