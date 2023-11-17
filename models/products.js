"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        // 2. Users 모델에게 1:1 관계 설정을 합니다.
        targetKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "createdId", // 4. UserInfos 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }
  Products.init(
    {
      productId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      createdId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      productName: DataTypes.STRING,
      price: DataTypes.INTEGER,
      productQuantity: { type: DataTypes.INTEGER, defaultValue: 1 },
      productStatus: {
        type: DataTypes.STRING,
        values: ["FOR_SALE", "SOLD_OUT"],
        defaultValue: "FOR_SALE",
      },
      productComments: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  Products.beforeCreate(async (product, options) => {
    if (product.productQuantity === 0) {
      product.productStatus = "SOLD_OUT";
    }
  });
  return Products;
};
