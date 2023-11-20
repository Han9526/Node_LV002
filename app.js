const express = require('express');
const usersRouter = require('./routers/signup.router');
const authRouter = require('./routers/signin.router');
const productRouter = require('./routers/products.router');
require('dotenv').config();
const env = process.env;
const sequelize = require('./models').sequelize;

const app = express();

sequelize.sync();

app.use(express.json());

app.use('/api', [usersRouter, authRouter, productRouter]);

app.listen(env.PORT, () => {
  console.log(env.PORT, '포트 번호로 서버가 실행되었습니다.');
});
