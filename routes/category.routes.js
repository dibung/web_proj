const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth');

// 카테고리 생성 (관리자 인증 필요)
router.post('/', authenticate, categoryController.createCategory);

// 카테고리 목록 조회 (인증 없이 가능)
router.get('/', categoryController.getCategories);

module.exports = router;
