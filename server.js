const app = require('./app');
const { connectDB } = require('./db');
const setupSwagger = require('./swagger'); // JSDoc 기반 Swagger 등

// Swagger 세팅
setupSwagger(app);

const PORT = process.env.PORT || 3000;

// DB 연결 후 서버 시작
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ 서버 시작 실패:', err);
    process.exit(1);
  });
