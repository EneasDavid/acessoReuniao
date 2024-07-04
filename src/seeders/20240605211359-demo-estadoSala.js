'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('estadoSalas', [{
        observacao: 'Sala está com arconcidionado quebrado',
        idSala: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        observacao: 'Sala está com televisão quebrada',
        idSala: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        observacao: '',
        idSala: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        observacao: '',
        idSala: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('estadoSalas', null, {});
  }
};
