const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthService = require('../services/auth.service');

router.post('/login', 
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      res.json(tokens);
    } catch (err) {
      res.status(err.status || 500).json(err);
    }
  }
);

router.get('/protected', AuthService.authenticate, (req, res) => {
  res.json({ message: '인증 성공', user: req.user });
});

router.get('/admin', AuthService.authenticate, AuthService.authorizeAdmin, (req, res) => {
  res.json({ message: '관리자 접근 허용' });
});

module.exports = router;
