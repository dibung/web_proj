// src/routes/book.routes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// 책 생성
router.post('/', bookController.createBook);

// 책 목록 조회 (검색/정렬/페이지네이션)
router.get('/', bookController.getBooks);

// 단일 책 조회
router.get('/:id', bookController.getBook);

// 책 수정
router.patch('/:id', bookController.updateBook);

// 책 삭제
router.delete('/:id', bookController.deleteBook);

module.exports = router;
