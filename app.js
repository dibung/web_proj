const express = require('express');
const app = express();

app.use(express.json());

// routes
app.use('/posts', require('./routes/post.routes'));

// error handler (항상 마지막)
app.use(require('./middlewares/errorHandler'));

module.exports = app;
