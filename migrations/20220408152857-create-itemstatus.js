"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Itemstatuses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
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
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          isNumeric: true,
          notEmpty: true,
          min: 1,
        },
      },
      itementryid: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Itementries",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      locationid: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        references: {
          model: {
            tableName: "Locations",
          },
          key: "id",
        },
        onDelete: "RESTRICT",
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
    await queryInterface.dropTable("Itemstatuses");
  },
};
