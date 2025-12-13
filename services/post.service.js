const db = require('../db');
const { parsePagination } = require('../utils/pagination');

exports.getPosts = async (query) => {
  const { page, size, sortField, sortDir } = parsePagination(query);
  const offset = page * size;

  const { keyword, category, dateFrom, dateTo } = query;

  let where = 'WHERE 1=1';
  const params = [];

  if (keyword) {
    where += ' AND title LIKE ?';
    params.push(`%${keyword}%`);
  }

  if (category) {
    where += ' AND category = ?';
    params.push(category);
  }

  if (dateFrom && dateTo) {
    where += ' AND created_at BETWEEN ? AND ?';
    params.push(dateFrom, dateTo);
  }

  const [[count]] = await db.query(
    `SELECT COUNT(*) total FROM posts ${where}`,
    params
  );

  const [rows] = await db.query(
    `
    SELECT * FROM posts
    ${where}
    ORDER BY ${sortField} ${sortDir}
    LIMIT ? OFFSET ?
    `,
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
};
