const db = require('../db');

class OrderService {
  static async createOrder(userId, items) {
    const conn = await db.getConnection(); // db.js에서 가져옴
    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.query(
        'INSERT INTO orders (user_id, status) VALUES (?, ?)',
        [userId, 'pending']
      );
      const orderId = orderResult.insertId;

      const orderItemsValues = items.map(i => [orderId, i.book_id, i.quantity]);
      await conn.query(
        'INSERT INTO order_item (order_id, book_id, quantity) VALUES ?',
        [orderItemsValues]
      );

      await conn.commit();
      return { order_id: orderId, user_id: userId, status: 'pending' };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async getOrders({ userId, page = 1, size = 10, sort = 'ordered_at,DESC', status }) {
    const offset = (page - 1) * size;
    const [sortField, sortOrder] = sort.split(',');

    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(parseInt(size), offset);

    const [orders] = await db.query(query, params); // db.query 사용

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.id as order_item_id, b.id as book_id, b.title, b.price, oi.quantity
         FROM order_item oi
         JOIN book b ON oi.book_id = b.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    // 전체 카운트
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    const countParams = [userId];
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    const [countResult] = await db.query(countQuery, countParams);
    const totalElements = countResult[0].total;

    return {
      content: orders,
      page: parseInt(page),
      size: parseInt(size),
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      sort: `${sortField},${sortOrder}`
    };
  }

  // updateOrderStatus / deleteOrder도 동일하게 db.query 사용
}

module.exports = OrderService;
