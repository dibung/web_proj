const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ code: 'TOKEN_EXPIRED', message: '유효하지 않은 토큰입니다.' });
  }

  req.user = payload; // payload 안에 userId, role 등 포함
  next();
}

function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ code: 'FORBIDDEN', message: '권한이 없습니다.' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
