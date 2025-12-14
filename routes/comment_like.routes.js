const express = require('express');
const router = express.Router();
const CommentLikeController = require('../controllers/comment_like.controller');

router.post('/', CommentLikeController.like);

module.exports = router;
