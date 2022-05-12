"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itemstatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Itementry, Location, Staff, History }) {
      this.belongsTo(Itementry, {
        foreignKey: {
          name: "itementryid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });

      this.belongsTo(Location, {
        foreignKey: {
          name: "locationid",
          type: DataTypes.INTEGER,
          defaultValue: null,
        },
        onDelete: "RESTRICT",
      });

      this.belongsTo(Staff, {
        foreignKey: {
          name: "staffid",
          type: DataTypes.INTEGER,
          defaultValue: null,
        },
        onDelete: "RESTRICT",
      });

      this.hasMany(History, {
        foreignKey: {
          name: "itemstatusid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });

      // define association here
    }
  }
  Itemstatus.init(
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [
            [
              "notassigned",
              "condemned",
              "assigned",
              "missing",
              "spare",
              "transferred",
            ],
          ],
        },
      },
      itemno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: "Itemstatus",
    }
  );
  return Itemstatus;
};
