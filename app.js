const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routers/signup.router');
const authRouter = require('./routers/signin.router');
const productRouter = require('./routers/products.router');

const sequelize = require('./models').sequelize;

const app = express();
const PORT = 3000;

sequelize.sync();
app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, authRouter, productRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
