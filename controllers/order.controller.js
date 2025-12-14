// const OrderService = require('../services/order.service');

// class OrderController {
//   static async createOrder(req, res, next) {
//     try {
//       const userId = req.body.user_id;
//       const items = req.body.items; // [{book_id, quantity}, ...]
//       const order = await OrderService.createOrder(userId, items);
//       res.status(201).json({ message: '주문 생성 완료', order });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async getOrders(req, res, next) {
//     try {
//       const userId = req.params.user_id;
//       const orders = await OrderService.getOrders(userId);
//       res.status(200).json({ orders });
//     } catch (err) {
//       next(err);
//     }
//   }

//     static async updateOrderStatus(req, res, next) {
//     try {
//       const orderId = req.params.order_id;
//       const { status } = req.body;
//       const order = await OrderService.updateOrderStatus(orderId, status);
//       res.status(200).json({ message: '주문 상태 변경 완료', order });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async deleteOrder(req, res, next) {
//     try {
//       const orderId = req.params.order_id;
//       const result = await OrderService.deleteOrder(orderId);
//       res.status(200).json({ message: '주문 삭제 완료', result });
//     } catch (err) {
//       next(err);
//     }
//   }
// }

// module.exports = OrderController;

// src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth');

// 주문 생성
router.post('/', authenticate, OrderController.createOrder);

// 주문 목록 조회
router.get('/', authenticate, OrderController.getOrders);

// 주문 상태 변경 (관리자)
router.patch('/:order_id/status', authenticate, authorize(['ROLE_ADMIN']), OrderController.updateOrderStatus);

// 주문 삭제
router.delete('/:order_id', authenticate, authorize(['ROLE_ADMIN']), OrderController.deleteOrder);

module.exports = router;

