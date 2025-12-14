// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const orderRoutes = require('./routes/order.routes');

const { errorHandler } = require('./middlewares/errorHandler');
const db = require('./db'); // db.js

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '1.0.0', timestamp: new Date() });
});

// Error handler (항상 마지막)
app.use(errorHandler);

// 서버 시작 전에 DB 연결
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.connectDB(); // DB 연결
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/docs`);
    });
  } catch (err) {
    console.error('❌ 서버 시작 실패:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
