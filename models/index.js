'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config'); // 변경된 부분
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;
if (config[env].use_env_variable) {
  sequelize = new Sequelize(
    process.env[config[env].use_env_variable],
    config[env]
  );
} else {
  sequelize = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    config[env]
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('MySQL 연결됨.');
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = db;
