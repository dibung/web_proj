const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '1h'; // Access token 유효시간
const REFRESH_EXPIRES = '7d';

class AuthService {
  // 로그인
  static async login(email, password) {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) throw { status: 401, code: 'USER_NOT_FOUND', message: '유저를 찾을 수 없습니다.' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 401, code: 'INVALID_CREDENTIAL', message: '비밀번호가 일치하지 않습니다.' };

    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });

    return { accessToken, refreshToken };
  }

  // 토큰 검증 미들웨어
  static authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ status: 401, code: 'UNAUTHORIZED', message: '토큰이 없습니다.' });

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ status: 401, code: 'TOKEN_EXPIRED', message: '토큰이 만료되었거나 유효하지 않습니다.' });
    }
  }

  // 관리자 권한 체크
  static authorizeAdmin(req, res, next) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 403, code: 'FORBIDDEN', message: '관리자 권한이 필요합니다.' });
    }
    next();
  }
}

module.exports = AuthService;
