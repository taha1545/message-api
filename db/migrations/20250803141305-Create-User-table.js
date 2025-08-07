"use strict";

module.exports = {
  //
  async up(queryInterface, Sequelize) {
    //
    return await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "client",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imagePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      IsVerify: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      otpCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otpAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("users");
  },
};
