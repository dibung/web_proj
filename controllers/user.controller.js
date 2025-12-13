const userService = require('../services/user.service');
const ApiError = require('../errors/ApiError');
const ERROR = require('../errors/errorCodes');

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, username, admin } = req.body;

    if (!email || !password || !username) {
      return next(new ApiError(ERROR.VALIDATION_FAILED, { message: '필수 값 누락' }));
    }

    const user = await userService.createUser({ email, password, username, admin });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new ApiError(ERROR.RESOURCE_NOT_FOUND));
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const result = await userService.deactivateUser(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
