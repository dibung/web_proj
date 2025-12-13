const orderService = require('../services/order.service');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder({ user_id: req.user.id, items: req.body.items });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return next(new ApiError(ERROR.RESOURCE_NOT_FOUND));
    res.json(order);
  } catch (err) {
    next(err);
  }
};
