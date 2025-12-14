const db = require('../db');

class FavoriteService {
  // 즐겨찾기 추가
  static async add({ user_id, book_id }) {
    const [existing] = await db.query(
      'SELECT * FROM favorite WHERE user_id = ? AND book_id = ?',
      [user_id, book_id]
    );
    if (existing.length > 0) {
      throw new Error('이미 즐겨찾기에 추가됨');
    }
    const [result] = await db.query(
      'INSERT INTO favorite (user_id, book_id) VALUES (?, ?)',
      [user_id, book_id]
    );
    return { id: result.insertId, user_id, book_id };
  }

  // 즐겨찾기 목록 조회
  static async list(user_id) {
    const [rows] = await db.query(
      'SELECT * FROM favorite WHERE user_id = ?',
      [user_id]
    );
    return rows;
  }

  // 즐겨찾기 삭제
  static async remove(id) {
    await db.query('DELETE FROM favorite WHERE id = ?', [id]);
    return { id };
  }
}

module.exports = FavoriteService;
