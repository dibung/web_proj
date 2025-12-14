const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');

// 댓글 생성
router.post('/', CommentController.create);

// 댓글 목록 조회 (review_id 기준)
router.get('/review/:review_id', CommentController.list);

// 단일 댓글 조회
router.get('/:id', CommentController.get);

// 댓글 수정
router.patch('/:id', CommentController.update);

// 댓글 삭제
router.delete('/:id', CommentController.delete);

module.exports = router;
