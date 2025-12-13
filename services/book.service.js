const db = require('../db');
const { parsePagination } = require('../utils/pagination');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.getBooks = async (query) => {
  const { page, size, sortField, sortDir } = parsePagination(query);
  const offset = page * size;

  const { keyword, category, author, priceFrom, priceTo, dateFrom, dateTo } = query;

  // WHERE 절 초기화
  let where = 'WHERE 1=1';
  const params = [];

  // 검색 필터
  if (keyword) {
    where += ' AND book.title LIKE ?';
    params.push(`%${keyword}%`);
  }

  if (category) {
    where += ' AND category.id = ?';
    params.push(category);
  }

  if (author) {
    where += ' AND author.id = ?';
    params.push(author);
  }

  if (priceFrom != null && priceTo != null) {
    where += ' AND book.price BETWEEN ? AND ?';
    params.push(priceFrom, priceTo);
  }

  if (dateFrom && dateTo) {
    where += ' AND book.published_at BETWEEN ? AND ?';
    params.push(dateFrom, dateTo);
  }

  try {
    // 총 개수 조회
    const [[count]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM book
       JOIN category ON book.category_id = category.id
       JOIN author ON book.author_id = author.id
       ${where}`,
      params
    );

    // 실제 데이터 조회
    const [rows] = await db.query(
      `SELECT book.id, book.title, author.name AS author, category.category_name AS category,
              book.price, book.quantity, book.publisher, book.published_at, book.cover_image_url
       FROM book
       JOIN category ON book.category_id = category.id
       JOIN author ON book.author_id = author.id
       ${where}
       ORDER BY ${sortField} ${sortDir}
       LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    return {
      content: rows,
      page,
      size,
      totalElements: count.total,
      totalPages: Math.ceil(count.total / size),
      sort: `${sortField},${sortDir}`,
    };
  } catch (err) {
    // DB 오류 시 표준 에러 반환
    throw new ApiError(ERROR.DATABASE_ERROR, { details: err.message });
  }
};
