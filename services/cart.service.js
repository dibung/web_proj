const db = require('../db');

class CartService {
  // 장바구니 생성
  static async createCart({ user_id }) {
    const [result] = await db.query(
      'INSERT INTO cart (user_id) VALUES (?)',
      [user_id]
    );
    const [cart] = await db.query('SELECT * FROM cart WHERE id = ?', [result.insertId]);
    return cart[0];
  }

  // 장바구니 아이템 추가
  static async addItem({ cart_id, book_id, quantity }) {
    // 이미 존재하면 수량 증가
    const [existing] = await db.query(
      'SELECT * FROM cart_item WHERE cart_id = ? AND book_id = ?',
      [cart_id, book_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE cart_item SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
      const [updatedItem] = await db.query('SELECT * FROM cart_item WHERE id = ?', [existing[0].id]);
      return updatedItem[0];
    }

    // 새 아이템 추가
    const [result] = await db.query(
      'INSERT INTO cart_item (cart_id, book_id, quantity) VALUES (?, ?, ?)',
      [cart_id, book_id, quantity]
    );
    const [item] = await db.query('SELECT * FROM cart_item WHERE id = ?', [result.insertId]);
    return item[0];
  }

  // 장바구니 조회
  static async getCart(cart_id) {
    const [cart] = await db.query('SELECT * FROM cart WHERE id = ?', [cart_id]);
    if (!cart.length) throw new Error('장바구니 없음');

    const [items] = await db.query(
      'SELECT ci.*, b.title, b.price FROM cart_item ci JOIN book b ON ci.book_id = b.id WHERE ci.cart_id = ?',
      [cart_id]
    );

    return { ...cart[0], items };
  }
}

module.exports = CartService;
