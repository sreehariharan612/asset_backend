"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ledger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Itementry }) {
      // define association here
      this.belongsTo(Itementry, {
        foreignKey: {
          name: "itementryid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
      // define association here
    }
  }
  Ledger.init(
    {
      volumeno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      pageno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      sno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      itemstatusentry: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      consumetype: {
        type: DataTypes.ENUM({
          values: ["consumable", "nonconsumable"],
        }),
        allowNull: false,
        validate: {
          notEmpty: true,
          // isIn: ["consumable", "nonconsumable"],
        },
      },
    },
    {
      sequelize,
      modelName: "Ledger",
    }
  );
  return Ledger;
};
