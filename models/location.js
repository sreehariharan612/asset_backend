"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Itemstatus }) {
      // define association here
      this.hasMany(Itemstatus, {
        foreignKey: {
          name: "locationid",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "RESTRICT",
      });
    }
  }
  Location.init(
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
      modelName: "Location",
    }
  );
  return Location;
};
