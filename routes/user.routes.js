const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware'); // JWT 검증

router.post('/', userController.createUser);
router.get('/', authMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, userController.getUser);
router.patch('/:id', authMiddleware, userController.updateUser);
router.patch('/:id/deactivate', authMiddleware, userController.deactivateUser);

module.exports = router;
