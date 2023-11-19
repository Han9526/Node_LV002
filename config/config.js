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
  test: {
    username: env.TEST_DB_USERNAME,
    password: env.TEST_DB_PASSWORD,
    database: env.TEST_DB_DATABASE,
    host: env.TEST_DB_HOST,
    dialect: env.TEST_DB_DIALECT,
  },
  production: {
    username: env.PRODUCTION_DB_USERNAME,
    password: env.PRODUCTION_DB_PASSWORD,
    database: env.PRODUCTION_DB_DATABASE,
    host: env.PRODUCTION_DB_HOST,
    dialect: env.PRODUCTION_DB_DIALECT,
  },
};
