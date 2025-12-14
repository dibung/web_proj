const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');
const { authenticate } = require('../middlewares/auth');

// 작가 생성 (인증 필요)
router.post('/', authenticate, authorController.createAuthor);

// 작가 목록 조회 (인증 없이 가능)
router.get('/', authorController.getAuthors);

module.exports = router;
