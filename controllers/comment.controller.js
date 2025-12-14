const CommentService = require('../services/comment.service');

class CommentController {
  // 댓글 생성
  static async create(req, res, next) {
    try {
      const { user_id, review_id, body } = req.body;
      const comment = await CommentService.create({ user_id, review_id, body });
      res.status(201).json({ message: '댓글 생성', comment });
    } catch (err) {
      next(err);
    }
  }

  // 댓글 목록 조회
  static async list(req, res, next) {
    try {
      const { review_id } = req.params;
      const { search, page, limit, sortBy, sortOrder } = req.query;
      const result = await CommentService.list({
        review_id,
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC'
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // 댓글 단일 조회
  static async get(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await CommentService.getById(id);
      if (!comment) return res.status(404).json({ message: '댓글 없음' });
      res.json(comment);
    } catch (err) {
      next(err);
    }
  }

  // 댓글 수정
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { body } = req.body;
      const comment = await CommentService.update(id, { body });
      res.json({ message: '댓글 수정', comment });
    } catch (err) {
      next(err);
    }
  }

  // 댓글 삭제
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await CommentService.delete(id);
      res.json({ message: '댓글 삭제', id });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CommentController;
