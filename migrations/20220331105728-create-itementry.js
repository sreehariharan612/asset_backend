'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Itementries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brand: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true 
      }
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull : false,
        validate: {
          isInt: true,
          isNumeric: true,          
          notEmpty: true,
          min: 1,  
      }
      },
      totalprice: {
        type: Sequelize.INTEGER,
        allowNull : false,
        validate: {
          isInt: true,
          isNumeric: true,          
          notEmpty: true,  
      }
      },
      itemid: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Items',
          },
          key: 'id'
        },
        onDelete: 'RESTRICT',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Itementries');
  }
};