// routes/book.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/book.controller');

router.get('/', controller.getBooks);

module.exports = router;
