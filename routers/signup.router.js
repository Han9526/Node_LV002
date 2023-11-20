// routes/users.route.js

const express = require('express');
const { Users } = require('../models');
const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  const { password, name, email } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });
  const emailRegex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (emailRegex.test(email) === false) {
    return res.status(400).json({ message: '형식에 맞게 입력하시오' });
  }
  if (/\s/.test(email)) {
    return res
      .status(400)
      .json({ message: 'email 입력칸에 공백이 존재 합니다' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: '6자리 이상 입력' });
  }
  if (/\s/.test(password)) {
    return res
      .status(400)
      .json({ message: 'password 입력칸에 공백이 존재 합니다' });
  }

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  const user = await Users.create({ password, name, email });

  return res.status(200).json({
    message: '회원가입이 완료되었습니다.',
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = router;
