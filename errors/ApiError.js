class ApiError extends Error {
  constructor(errorCode, details = null) {
    super(errorCode.message);
    this.status = errorCode.status;
    this.code = errorCode.code;
    this.details = details;
  }
}

module.exports = ApiError;
