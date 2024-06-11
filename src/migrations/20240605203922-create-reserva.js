'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
  
      idSala: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'salas',
          key: 'id'
        },
      },
     idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'usuarios',
          key: 'id'
        },
      },
  
      idRecepcionista: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /*
        references:{
          model: 'recepcionistas',
          key: 'id'
        },
        */        
      },

      dataReservada: {
        type: Sequelize.STRING,
        allowNull: false
      },
      horaInicio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      horaFimReserva: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statusReserva: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataModificacaoStatus: {
        type: Sequelize.STRING,
        allowNull: true
      },
      motivoReserva: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('reservas');
  }
};