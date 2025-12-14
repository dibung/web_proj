// src/services/book.service.js
const pool = require('../db');

/**
 * 책 생성
 * @param {Object} bookData
 */
async function createBook(bookData) {
  const {
    title,
    author_id,
    category_id,
    price,
    quantity,
    publisher,
    cover_image_url
  } = bookData;

  const [result] = await pool.query(
    `INSERT INTO books
      (title, author_id, category_id, price, quantity, publisher, cover_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, author_id, category_id, price, quantity, publisher, cover_image_url]
  );

  // 생성된 책 ID 반환
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * 책 조회 (단건)
 * @param {number} bookId
 */
async function getBookById(bookId) {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
  return rows[0];
}

/**
 * 책 목록 조회 + 검색/정렬/페이지네이션
 * @param {Object} options
 *   - page: 페이지 (기본 1)
 *   - size: 페이지 크기 (기본 10)
 *   - keyword: 제목 검색
 *   - category_id: 카테고리 필터
 *   - author_id: 작가 필터
 *   - sort: 'price,DESC' 또는 'title,ASC' 등
 */
async function getBooks(options = {}) {
  let { page = 1, size = 10, keyword, category_id, author_id, sort } = options;
  page = parseInt(page);
  size = parseInt(size);

  const offset = (page - 1) * size;

  // WHERE 절 동적 생성
  const conditions = [];
  const params = [];

  if (keyword) {
    conditions.push('title LIKE ?');
    params.push(`%${keyword}%`);
  }

  if (category_id) {
    conditions.push('category_id = ?');
    params.push(category_id);
  }

  if (author_id) {
    conditions.push('author_id = ?');
    params.push(author_id);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // 정렬
  let orderClause = '';
  if (sort) {
    const [field, direction] = sort.split(',');
    const dir = direction && direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const allowedFields = ['title', 'price', 'published_at', 'quantity'];
    if (allowedFields.includes(field)) {
      orderClause = `ORDER BY ${field} ${dir}`;
    }
  } else {
    orderClause = 'ORDER BY published_at DESC';
  }

  // 총 개수
  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total FROM books ${whereClause}`,
    params
  );
  const totalElements = countResult[0].total;
  const totalPages = Math.ceil(totalElements / size);

  // 데이터 조회
  const [rows] = await pool.query(
    `SELECT * FROM books ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
    [...params, size, offset]
  );

  return {
    content: rows,
    page,
    size,
    totalElements,
    totalPages,
    sort: orderClause.replace('ORDER BY ', '')
  };
}

/**
 * 책 정보 수정
 * @param {number} bookId
 * @param {Object} updateData
 */
async function updateBook(bookId, updateData) {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(updateData)) {
    fields.push(`${key} = ?`);
    params.push(value);
  }

  if (fields.length === 0) return getBookById(bookId);

  params.push(bookId);

  await pool.query(
    `UPDATE books SET ${fields.join(', ')} WHERE id = ?`,
    params
  );

  return getBookById(bookId);
}

/**
 * 책 삭제
 * @param {number} bookId
 */
async function deleteBook(bookId) {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
  if (!rows[0]) return null;

  await pool.query('DELETE FROM books WHERE id = ?', [bookId]);
  return rows[0];
}

module.exports = {
  createBook,
  getBookById,
  getBooks,
  updateBook,
  deleteBook
};
