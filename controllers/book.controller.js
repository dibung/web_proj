// src/controllers/book.controller.js
const bookService = require('../services/book.service');

/**
 * 책 생성
 */
async function createBook(req, res, next) {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ message: '책 생성 성공', book });
  } catch (err) {
    next(err);
  }
}

/**
 * 단일 책 조회
 */
async function getBook(req, res, next) {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    res.json(book);
  } catch (err) {
    next(err);
  }
}

/**
 * 책 목록 조회 + 검색/정렬/페이지네이션
 */
async function getBooks(req, res, next) {
  try {
    const options = {
      page: req.query.page,
      size: req.query.size,
      keyword: req.query.keyword,
      category_id: req.query.category_id,
      author_id: req.query.author_id,
      sort: req.query.sort
    };
    const result = await bookService.getBooks(options);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * 책 수정
 */
async function updateBook(req, res, next) {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.json({ message: '책 수정 성공', book });
  } catch (err) {
    next(err);
  }
}

/**
 * 책 삭제
 */
async function deleteBook(req, res, next) {
  try {
    const book = await bookService.deleteBook(req.params.id);
    if (!book) return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    res.json({ message: '책 삭제 성공', book });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBook,
  getBook,
  getBooks,
  updateBook,
  deleteBook
};
