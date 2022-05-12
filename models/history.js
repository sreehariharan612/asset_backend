"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Itemstatus, Location, Staff }) {
      // define association here
      this.belongsTo(Itemstatus, {
        foreignKey: {
          name: "itemstatusid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });

      this.belongsTo(Location, {
        foreignKey: {
          name: "pastlocationid",
          type: DataTypes.INTEGER,
        },
        onDelete: "RESTRICT",
      });

      this.belongsTo(Staff, {
        foreignKey: {
          name: "paststaffid",
          type: DataTypes.INTEGER,
        },
        onDelete: "RESTRICT",
      });
    }
  }
  History.init(
    {
      paststatus: {
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
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
