'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();
const env = process.env;
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Products, {
        sourceKey: 'userId',
        foreignKey: 'createdId',
      });
    }
  }
  Users.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Users',
    }
  );
  Users.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(
      user.password,
      env.DB_PASSWORD_SALT_ROUNDS
    );
    user.password = hashedPassword;
  });
  return Users;
};
