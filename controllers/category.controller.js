const pool = require('../db');
const ApiError = require('../errors/ApiError');

// 카테고리 생성
const createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    if (!category_name) throw new ApiError(400, 'VALIDATION_FAILED', '카테고리 이름은 필수입니다.');

    const [result] = await pool.query(
      'INSERT INTO categories (category_name) VALUES (?)',
      [category_name]
    );

    const [category] = await pool.query(
      'SELECT id AS _id, category_name FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(category[0]);
  } catch (err) {
    next(err);
  }
};

// 카테고리 목록 조회
const getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT id AS _id, category_name FROM categories ORDER BY category_name ASC'
    );
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getCategories
};
