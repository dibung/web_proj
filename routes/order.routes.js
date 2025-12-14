const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');

// 주문 생성
router.post('/', OrderController.createOrder);

// 특정 사용자 주문 목록 조회
router.get('/:user_id', OrderController.getOrders);

// 주문 상태 변경
router.patch('/:order_id', OrderController.updateOrderStatus);

// 주문 삭제
router.delete('/:order_id', OrderController.deleteOrder);


module.exports = router;
