const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');

// 즐겨찾기 추가
router.post('/', FavoriteController.add);

// 즐겨찾기 목록 조회 (user_id 기준)
router.get('/:user_id', FavoriteController.list);

// 즐겨찾기 삭제
router.delete('/:id', FavoriteController.remove);

module.exports = router;
