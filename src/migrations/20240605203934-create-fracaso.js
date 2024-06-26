'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fracasos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exception: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mensage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tabelaRelacionada: {
        type: Sequelize.STRING,
        allowNull: false
      },
      funcaoRelacionada: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('fracasos');
  }
};