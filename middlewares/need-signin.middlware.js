const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({
      errorMessage: 'accessToken 없음 로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }
  const [authType, authToken] = authorization.split(' ');

  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: 'accessToken 형태 확인 부탁',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.JWT_KEY);
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(401).send({
        errorMessage: 'token Payload에 데이터가 없습니다',
      });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(419).json({ message: '토큰이 만료되었습니다' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다.',
      });
    } else {
      return res.status(401).send({
        errorMessage: '로그인 후 이용 가능한 기능입니다.',
      });
    }
  }
};
