const reviewService = require('../services/review.service');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview({
      user_id: req.user.id,
      ...req.body
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByBook(req.params.book_id);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const updated = await reviewService.updateReview(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
