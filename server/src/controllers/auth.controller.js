const { sendSuccess } = require('../utils/apiResponse');
const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    if (result.pendingApproval) {
      return sendSuccess(
        res,
        { user: result.user, pendingApproval: true, message: result.message },
        null,
        201
      );
    }
    const session = await authService.attachSession(res, result.user);
    return sendSuccess(res, { ...session, pendingApproval: false }, null, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await authService.login(req.body);
    const session = await authService.attachSession(res, user);
    return sendSuccess(res, session);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const raw = req.cookies[authService.REFRESH_COOKIE];
    const user = await authService.refresh(raw);
    const session = await authService.attachSession(res, user, { issueRefresh: false });
    return sendSuccess(res, session);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const raw = req.cookies[authService.REFRESH_COOKIE];
    await authService.logout(raw, req.user?._id);
    res.clearCookie(authService.REFRESH_COOKIE, authService.cookieOptions());
    return sendSuccess(res, { loggedOut: true });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const data = await authService.getMe(req.user);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    await authService.changePassword(
      req.user._id,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.clearCookie(authService.REFRESH_COOKIE, authService.cookieOptions());
    return sendSuccess(res, { message: 'Password updated. Please sign in again.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, me, changePassword };
