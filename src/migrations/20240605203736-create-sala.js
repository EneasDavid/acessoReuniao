'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      andar: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      area: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capMax: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      situacao: {
        type: Sequelize.CHAR,
        defaultValue: 'D',
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
    await queryInterface.dropTable('salas');
  }
};