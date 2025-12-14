const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth');

// 회원가입
router.post('/', userController.createUser);

// 사용자 삭제
router.delete('/:id', authenticate, userController.deleteUser);

// 로그인 (토큰 생성)
router.post('/login', userController.login);

module.exports = router;
