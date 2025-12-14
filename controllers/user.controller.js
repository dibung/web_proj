const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// 회원가입
const createUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      throw new ApiError(400, 'VALIDATION_FAILED', '모든 필수 항목을 입력해야 합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
      [email, hashedPassword, username]
    );

    const [user] = await pool.query('SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: '회원가입 성공',
      user: user[0]
    });
  } catch (err) {
    next(err);
  }
};

// 사용자 삭제
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      message: '사용자 삭제',
      user_id: userId
    });
  } catch (err) {
    next(err);
  }
};

// 로그인
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, 'VALIDATION_FAILED', '이메일과 비밀번호를 입력해야 합니다.');

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) throw new ApiError(401, 'UNAUTHORIZED', '사용자를 찾을 수 없습니다.');

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(401, 'UNAUTHORIZED', '비밀번호가 올바르지 않습니다.');

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: '로그인 성공',
      token,
      user: {
        _id: user.id,
        name: user.username,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  deleteUser,
  login
};
