'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('listaNegras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idResponsavel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /*
        references:{
          model: 'recepcionistas',
          key: 'id'
        }
        */
      },
      idReservaMotivo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'reservas',
          key: 'id'
        }
      },
      codBloqueio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      motivo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataBloqueio: {
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
    await queryInterface.dropTable('listaNegras');
  }
};