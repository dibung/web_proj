const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const details = {};
    error.details.forEach(e => {
      details[e.path[0]] = e.message;
    });

    return next(new ApiError(ERROR.VALIDATION_ERROR, details));
  }

  next();
};
