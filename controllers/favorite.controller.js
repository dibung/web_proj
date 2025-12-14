const FavoriteService = require('../services/favorite.service');

class FavoriteController {
  static async add(req, res, next) {
    try {
      const { user_id, book_id } = req.body;
      const favorite = await FavoriteService.add({ user_id, book_id });
      res.status(201).json({ message: '즐겨찾기 추가', favorite });
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const { user_id } = req.params;
      const favorites = await FavoriteService.list(user_id);
      res.json({ favorites });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      const { id } = req.params;
      await FavoriteService.remove(id);
      res.json({ message: '즐겨찾기 삭제', id });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FavoriteController;
