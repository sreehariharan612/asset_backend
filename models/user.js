"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      role: {
        type: DataTypes.ENUM({
          values: ["HOD", "superdent", "assigner"],
        }),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["HOD", "superdent", "assigner"]],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};