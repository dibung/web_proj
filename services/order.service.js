const db = require('../db');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createOrder = async ({ user_id, items }) => {
  if (!items || items.length === 0) {
    throw new ApiError(ERROR.VALIDATION_FAILED, { message: '주문 아이템이 필요합니다.' });
  }

  // 트랜잭션 시작
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id) VALUES (?)`,
      [user_id]
    );
    const order_id = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_item (order_id, book_id, quantity, category_id) VALUES (?, ?, ?, ?)`,
        [order_id, item.book_id, item.quantity, item.category_id]
      );

      // 재고 감소
      await conn.query(
        `UPDATE book SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`,
        [item.quantity, item.book_id, item.quantity]
      );
    }

    await conn.commit();
    return { order_id, user_id, items };
  } catch (err) {
    await conn.rollback();
    throw new ApiError(ERROR.DATABASE_ERROR, { details: err.message });
  } finally {
    conn.release();
  }
};

exports.getOrdersByUser = async (user_id) => {
  const [orders] = await db.query(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY ordered_at DESC`,
    [user_id]
  );
  return orders;
};

exports.getOrderById = async (id) => {
  const [orders] = await db.query(`SELECT * FROM orders WHERE id = ?`, [id]);
  return orders[0];
};
