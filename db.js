const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

const connectDB = async () => {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // 연결 테스트
      const connection = await pool.getConnection();
      console.log('✅ MySQL 연결 성공');
      connection.release();
    } catch (err) {
      console.error('❌ MySQL 연결 실패:', err);
      throw err;
    }
  }
  return pool;
};

// query와 getConnection을 기존처럼 사용 가능
module.exports = {
  query: async (...args) => {
    const p = await connectDB();
    return p.query(...args);
  },
  getConnection: async () => {
    const p = await connectDB();
    return p.getConnection();
  }
};
