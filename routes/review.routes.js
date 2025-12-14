const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');

// 리뷰 작성
router.post('/', ReviewController.createReview);

// 책별 리뷰 조회
router.get('/book/:book_id', ReviewController.getReviewsByBook);

// 리뷰 좋아요
router.post('/:review_id/like', ReviewController.likeReview);

// 리뷰 삭제
router.delete('/:review_id', ReviewController.deleteReview);

module.exports = router;
