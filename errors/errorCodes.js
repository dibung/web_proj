module.exports = {
  POST_INVALID_TITLE: { status: 400, code: 'POST_INVALID_TITLE', message: 'title length must be 1~100' },
  POST_INVALID_CONTENT: { status: 400, code: 'POST_INVALID_CONTENT', message: 'content is required' },

  AUTH_UNAUTHORIZED: { status: 401, code: 'AUTH_UNAUTHORIZED', message: 'unauthorized' },
  AUTH_FORBIDDEN: { status: 403, code: 'AUTH_FORBIDDEN', message: 'forbidden' },

  POST_NOT_FOUND: { status: 404, code: 'POST_NOT_FOUND', message: 'post not found' },

  POST_DUPLICATED: { status: 409, code: 'POST_DUPLICATED', message: 'duplicated resource' },

  VALIDATION_ERROR: { status: 422, code: 'VALIDATION_ERROR', message: 'validation failed' },

  TOO_MANY_REQUESTS: { status: 429, code: 'TOO_MANY_REQUESTS', message: 'too many requests' },

  INTERNAL_SERVER_ERROR: { status: 500, code: 'INTERNAL_SERVER_ERROR', message: 'internal server error' },
};
