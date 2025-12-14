const CartService = require('../services/cart.service');

class CartController {
  static async createCart(req, res, next) {
    try {
      const { user_id } = req.body;
      const cart = await CartService.createCart({ user_id });
      res.status(201).json({ message: '장바구니 생성', cart });
    } catch (err) {
      next(err);
    }
  }

  static async addItem(req, res, next) {
    try {
      const { cart_id, book_id, quantity } = req.body;
      const item = await CartService.addItem({ cart_id, book_id, quantity });
      res.status(201).json({ message: '장바구니 아이템 추가', item });
    } catch (err) {
      next(err);
    }
  }

  static async getCart(req, res, next) {
    try {
      const { cart_id } = req.params;
      const cart = await CartService.getCart(cart_id);
      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartController;
