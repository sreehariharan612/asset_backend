"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Item }) {
      // define association here
      this.hasMany(Item,  {  foreignKey: {
        name: 'categoryid',
        type: DataTypes.INTEGER,
        allowNull: false
      }, onDelete: 'RESTRICT'});
    }
  }
  Category.init(
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
      modelName: "Category",
    }
  );
  return Category;
};
