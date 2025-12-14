const ReviewLikeService = require('../services/review_like.service');

class ReviewLikeController {
  static async like(req, res, next) {
    try {
      const { user_id, review_id } = req.body;
      const like = await ReviewLikeService.like({ user_id, review_id });
      res.status(201).json({ message: '리뷰 좋아요', like });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewLikeController;

