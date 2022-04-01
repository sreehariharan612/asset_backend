'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Itementry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Item,Ledger}) {
      this.belongsTo(Item,{  foreignKey: {
        name: 'itemid',
        type: DataTypes.INTEGER,
        allowNull: false
      }, onDelete: 'RESTRICT'})

      this.hasOne(Ledger,  {  foreignKey: {
        name: 'itementryid',
        type: DataTypes.INTEGER,
        allowNull: false
      }, onDelete: 'CASCADE'});
    }
      // define association here
    }
  
  Itementry.init({
    brand: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true 
    }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull : false,
      validate: {
        isInt: true,
        isNumeric: true,          
        notEmpty: true,
        min: 1,  
    }
    },
    totalprice: {
      type: DataTypes.INTEGER,
      allowNull : false,
      validate: {
        isInt: true,
        isNumeric: true,          
        notEmpty: true,  
    }
    }
  }, {
    sequelize,
    modelName: 'Itementry',
  });
  return Itementry;
};