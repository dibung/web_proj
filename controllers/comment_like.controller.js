const CommentLikeService = require('../services/comment_like.service');

class CommentLikeController {
  static async like(req, res, next) {
    try {
      const { user_id, comment_id } = req.body;
      const like = await CommentLikeService.like({ user_id, comment_id });
      res.status(201).json({ message: '댓글 좋아요', like });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CommentLikeController;

