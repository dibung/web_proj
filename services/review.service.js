const db = require('../db');

class ReviewService {
  // 리뷰 작성
  static async createReview({ user_id, book_id, title, body }) {
    const [result] = await db.query(
      'INSERT INTO review (user_id, book_id, title, body) VALUES (?, ?, ?, ?)',
      [user_id, book_id, title || null, body || null]
    );
    const [review] = await db.query('SELECT * FROM review WHERE id = ?', [result.insertId]);
    return review[0];
  }

  // 리뷰 조회 (책별)
  static async getReviewsByBook(book_id) {
    const [reviews] = await db.query(
      'SELECT * FROM review WHERE book_id = ? ORDER BY created_at DESC',
      [book_id]
    );
    return reviews;
  }

  // 리뷰 좋아요 증가
  static async likeReview(review_id) {
    const [result] = await db.query(
      'UPDATE review SET like_count = like_count + 1 WHERE id = ?',
      [review_id]
    );
    if (result.affectedRows === 0) throw new Error('리뷰를 찾을 수 없습니다.');
    const [review] = await db.query('SELECT * FROM review WHERE id = ?', [review_id]);
    return review[0];
  }

  // 리뷰 삭제
  static async deleteReview(review_id) {
    const [result] = await db.query('DELETE FROM review WHERE id = ?', [review_id]);
    if (result.affectedRows === 0) throw new Error('리뷰를 찾을 수 없습니다.');
    return { review_id };
  }
}

module.exports = ReviewService;
