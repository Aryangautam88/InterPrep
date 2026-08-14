const { sendSuccess } = require('../utils/apiResponse');

function ping(req, res) {
  return sendSuccess(res, {
    role: req.user.role,
    message: `${req.user.role} access granted`,
  });
}

module.exports = { ping };
