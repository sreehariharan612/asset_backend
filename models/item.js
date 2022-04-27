"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category, Itementry }) {
      // define association here
      this.belongsTo(Category, {
        foreignKey: {
          name: "categoryid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "RESTRICT",
      });

      this.hasMany(Itementry, {
        foreignKey: {
          name: "itemid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "RESTRICT",
      });
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
