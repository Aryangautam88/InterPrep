const { AppError } = require('../utils/apiResponse');

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have access to this resource', 403, 'FORBIDDEN'));
    }
    next();
  };
}

module.exports = { authorize };
