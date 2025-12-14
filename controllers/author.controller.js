const pool = require('../db');
const ApiError = require('../errors/ApiError');

// 작가 생성
const createAuthor = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new ApiError(400, 'VALIDATION_FAILED', '작가 이름은 필수입니다.');

    const [result] = await pool.query(
      'INSERT INTO authors (name) VALUES (?)',
      [name]
    );

    const [author] = await pool.query('SELECT id AS _id, name, created_at FROM authors WHERE id = ?', [result.insertId]);

    res.status(201).json(author[0]);
  } catch (err) {
    next(err);
  }
};

// 작가 목록 조회
const getAuthors = async (req, res, next) => {
  try {
    const [authors] = await pool.query('SELECT id AS _id, name, created_at FROM authors ORDER BY created_at DESC');
    res.json(authors);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAuthor,
  getAuthors
};
