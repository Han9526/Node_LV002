const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/need-signin.middlware');
require('dotenv').config();

// 2. 로그인

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  } else if (!passwordMatch) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  const accessToken = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_KEY,
    { expiresIn: '12h' }
  );
  res.status(200).json({ accesstoken: accessToken });
});

// 내 정보 조회 API ( Middleware 사용)

router.get('/signin/me', authMiddleware, async (req, res) => {
  const { email, name, userId } = res.locals.user;
  res.status(200).json({
    user: { email, name, userId },
  });
});

module.exports = router;
