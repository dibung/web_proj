const db = require('../db');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createAuthor = async (data) => {
  const { name } = data;

  try {
    const [result] = await db.query(
      'INSERT INTO author (name) VALUES (?)',
      [name]
    );

    return {
      id: result.insertId,
      name,
    };
  } catch (err) {
    console.error('🔥 MySQL Error:', err); // ⭐⭐⭐ 이게 핵심
    throw err;
  }
};

