require('dotenv').config();
const env = process.env;

module.exports = {
  development: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    dialect: env.DB_TYPE,
  },
};
