"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Itemstatus, History }) {
      // define association here
      this.hasMany(Itemstatus, {
        foreignKey: {
          name: "staffid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "RESTRICT",
      });

      this.hasMany(History, {
        foreignKey: {
          name: "paststaffid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "RESTRICT",
      });
    }
  }
  Staff.init(
    {
      regid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );
  return Staff;
};
