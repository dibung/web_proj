const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');

router.post('/', CartController.createCart);          // 장바구니 생성
router.post('/items', CartController.addItem);       // 장바구니에 아이템 추가
router.get('/:cart_id', CartController.getCart);     // 장바구니 조회

module.exports = router;
