const db = require('../db');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createReview = async ({ user_id, book_id, title, body }) => {
  // 유저가 이미 리뷰를 작성했는지 확인
  const [existing] = await db.query(
    `SELECT * FROM review WHERE user_id = ? AND book_id = ?`,
    [user_id, book_id]
  );
  if (existing.length > 0) {
    throw new ApiError(ERROR.DUPLICATE_RESOURCE, { message: '이미 리뷰 작성됨' });
  }

  const [result] = await db.query(
    `INSERT INTO review (user_id, book_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [user_id, book_id, title, body]
  );
  return { id: result.insertId, user_id, book_id, title, body };
};

exports.getReviewsByBook = async (book_id) => {
  const [rows] = await db.query(
    `SELECT r.*, u.username FROM review r JOIN user u ON r.user_id = u.id WHERE r.book_id = ? ORDER BY created_at DESC`,
    [book_id]
  );
  return rows;
};

exports.updateReview = async (id, data) => {
  const fields = [];
  const params = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    params.push(data[key]);
  }

  params.push(id);
  await db.query(`UPDATE review SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, params);

  const [rows] = await db.query(`SELECT * FROM review WHERE id = ?`, [id]);
  return rows[0];
};

exports.deleteReview = async (id) => {
  await db.query(`UPDATE review SET deleted_at = NOW() WHERE id = ?`, [id]);
  return { id };
};
