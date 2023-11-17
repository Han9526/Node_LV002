require('dotenv').config();
const env = process.env;

const development = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  dialect: 'mysql',
};
const test = {
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_DATABASE,
  host: process.env.TEST_DB_HOST,
  dialect: process.env.TEST_DB_DIALECT,
};

const production = {
  username: process.env.PRODUCTION_DB_USERNAME,
  password: process.env.PRODUCTION_DB_PASSWORD,
  database: process.env.PRODUCTION_DB_DATABASE,
  host: process.env.PRODUCTION_DB_HOST,
  dialect: process.env.PRODUCTION_DB_DIALECT,
};

module.exports = { development, test, production };
