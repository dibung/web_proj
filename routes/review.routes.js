const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/book/:book_id', reviewController.getReviews);
router.patch('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
