// src/services/comment.service.js
const pool = require('../db');

class CommentService {
  // 댓글 생성
  static async create({ user_id, review_id, body }) {
    const [result] = await pool.execute(
      `INSERT INTO comment (user_id, review_id, body) VALUES (?, ?, ?)`,
      [user_id, review_id, body]
    );

    const [comment] = await pool.execute(
      `SELECT * FROM comment WHERE id = ?`,
      [result.insertId]
    );

    return comment[0];
  }

  // 댓글 목록 조회 (검색 + 페이징 + 정렬)
  static async list({ review_id, search = '', page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' }) {
    const offset = (page - 1) * limit;

    const [comments] = await pool.execute(
      `SELECT * 
       FROM comment 
       WHERE review_id = ? AND body LIKE ?
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [review_id, `%${search}%`, limit, offset]
    );

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total 
       FROM comment 
       WHERE review_id = ? AND body LIKE ?`,
      [review_id, `%${search}%`]
    );

    return {
      total,
      page,
      limit,
      comments
    };
  }

  // 댓글 단일 조회
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM comment WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // 댓글 수정
  static async update(id, { body }) {
    await pool.execute(
      `UPDATE comment SET body = ? WHERE id = ?`,
      [body, id]
    );
    return this.getById(id);
  }

  // 댓글 삭제 (soft delete)
  static async delete(id) {
    await pool.execute(
      `UPDATE comment SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
    return { id };
  }
}

module.exports = CommentService;
