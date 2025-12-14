const express = require('express');
const app = express();

// ✅ DB 불러오기 (이게 빠졌었음)
const db = require('./db');

(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ DB 연결 성공');
  } catch (err) {
    console.error('❌ DB 연결 실패', err.message);
  }
})();


const bookRoutes = require('./routes/book.routes');
const authorRoutes = require('./routes/author.routes');

app.use(express.json());

// ✅ DB 연결 테스트 (서버 시작 시 1번만)
db.query('SELECT 1')
  .then(() => console.log('✅ DB 연결 성공'))
  .catch(err => console.error('❌ DB 연결 실패', err));

// 라우트
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);

// 에러 핸들러 (HTML 말고 JSON으로!)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
