const db = require('../db');

class ReviewLikeService {
  static async like({ user_id, review_id }) {
    // 중복 체크
    const [existing] = await db.query(
      'SELECT * FROM review_like WHERE user_id = ? AND review_id = ?',
      [user_id, review_id]
    );
    if (existing.length > 0) {
      throw new Error('이미 좋아요한 리뷰');
    }

    // 좋아요 추가
    const [result] = await db.query(
      'INSERT INTO review_like (user_id, review_id) VALUES (?, ?)',
      [user_id, review_id]
    );

    // 리뷰 테이블 like_count 증가
    await db.query('UPDATE review SET like_count = like_count + 1 WHERE id = ?', [review_id]);

    return { id: result.insertId, user_id, review_id };
  }
}

module.exports = ReviewLikeService;
