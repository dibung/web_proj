module.exports = {
  BAD_REQUEST: { status: 400, code: 'BAD_REQUEST', message: '잘못된 요청입니다.' },
  VALIDATION_FAILED: { status: 400, code: 'VALIDATION_FAILED', message: '유효성 검사 실패' },
  INVALID_QUERY_PARAM: { status: 400, code: 'INVALID_QUERY_PARAM', message: '쿼리 파라미터 오류' },

  UNAUTHORIZED: { status: 401, code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
  TOKEN_EXPIRED: { status: 401, code: 'TOKEN_EXPIRED', message: '토큰이 만료되었습니다.' },

  FORBIDDEN: { status: 403, code: 'FORBIDDEN', message: '접근 권한이 없습니다.' },

  RESOURCE_NOT_FOUND: { status: 404, code: 'RESOURCE_NOT_FOUND', message: '리소스를 찾을 수 없습니다.' },
  USER_NOT_FOUND: { status: 404, code: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' },

  DUPLICATE_RESOURCE: { status: 409, code: 'DUPLICATE_RESOURCE', message: '중복된 데이터가 존재합니다.' },
  STATE_CONFLICT: { status: 409, code: 'STATE_CONFLICT', message: '리소스 상태 충돌' },

  UNPROCESSABLE_ENTITY: { status: 422, code: 'UNPROCESSABLE_ENTITY', message: '처리할 수 없는 요청입니다.' },

  TOO_MANY_REQUESTS: { status: 429, code: 'TOO_MANY_REQUESTS', message: '요청이 너무 많습니다.' },

  INTERNAL_SERVER_ERROR: { status: 500, code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류' },
  DATABASE_ERROR: { status: 500, code: 'DATABASE_ERROR', message: '데이터베이스 오류' },
  UNKNOWN_ERROR: { status: 500, code: 'UNKNOWN_ERROR', message: '알 수 없는 오류' },
};
