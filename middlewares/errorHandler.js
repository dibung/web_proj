module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    status,
    code: err.code || 'UNKNOWN_ERROR',
    message: err.message || 'unexpected error',
    ...(err.details && { details: err.details }),
  });
};
    