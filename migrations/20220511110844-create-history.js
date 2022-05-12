"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Histories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      paststatus: {
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

      itemstatusid: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Itemstatuses",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },

      pastlocationid: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Locations",
          },
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      paststaffid: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Staffs",
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
    await queryInterface.dropTable("Histories");
  },
};
