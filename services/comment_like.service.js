const db = require('../db');

class CommentLikeService {
  static async like({ user_id, comment_id }) {
    const [existing] = await db.query(
      'SELECT * FROM comment_like WHERE user_id = ? AND comment_id = ?',
      [user_id, comment_id]
    );
    if (existing.length > 0) {
      throw new Error('이미 좋아요한 댓글');
    }

    const [result] = await db.query(
      'INSERT INTO comment_like (user_id, comment_id) VALUES (?, ?)',
      [user_id, comment_id]
    );

    // comment 테이블 like_count 증가
    await db.query('UPDATE comment SET like_count = like_count + 1 WHERE id = ?', [comment_id]);

    return { id: result.insertId, user_id, comment_id };
  }
}

module.exports = CommentLikeService;
