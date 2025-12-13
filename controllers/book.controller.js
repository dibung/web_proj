// controllers/book.controller.js
const bookService = require('../services/book.service');

exports.getBooks = async (req, res, next) => {
  try {
    const result = await bookService.getBooks(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};