"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Ledgers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      volumeno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      pageno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      sno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      hasitemstatusentry: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notEmpty: true,
        },
      },
      consumetype: {
        type: Sequelize.ENUM({
          values: ["consumable", "nonconsumable"],
        }),
        allowNull: false,
        primaryKey: true,
        validate: {
          notEmpty: true,
          isIn: ["consumable", "nonconsumable"],
        },
      },
      itementryid: {
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: {
            tableName: "Itementries",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Ledgers");
  },
};
