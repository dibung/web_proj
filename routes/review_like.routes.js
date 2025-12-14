const express = require('express');
const router = express.Router();
const ReviewLikeController = require('../controllers/review_like.controller');

router.post('/', ReviewLikeController.like);

module.exports = router;
