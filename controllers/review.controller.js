const ReviewService = require('../services/review.service');

class ReviewController {
  static async createReview(req, res, next) {
    try {
      const review = await ReviewService.createReview(req.body);
      res.status(201).json({ message: '리뷰 작성 완료', review });
    } catch (err) {
      next(err);
    }
  }

  static async getReviewsByBook(req, res, next) {
    try {
      const { book_id } = req.params;
      const reviews = await ReviewService.getReviewsByBook(book_id);
      res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }
  }

  static async likeReview(req, res, next) {
    try {
      const { review_id } = req.params;
      const review = await ReviewService.likeReview(review_id);
      res.status(200).json({ message: '리뷰 좋아요 완료', review });
    } catch (err) {
      next(err);
    }
  }

  static async deleteReview(req, res, next) {
    try {
      const { review_id } = req.params;
      const result = await ReviewService.deleteReview(review_id);
      res.status(200).json({ message: '리뷰 삭제 완료', result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewController;
