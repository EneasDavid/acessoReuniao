'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('salas', [
      {
        nome: 'Sala 1',
        andar: 1,
        area: 'coorwoking',
        capMax: 5,
        situacao: 'A',
        createdAt: new Date(),
        updatedAt: new Date()
        },
        {
          nome: 'Sala 2',
          andar: 1,
          area: 'coorwoking',
          capMax: 5,
          situacao: 'A',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: 'Sala 3',
          andar: 1,
          area: 'coorwoking',
          capMax: 5,
          situacao: 'A',
          createdAt: new Date(),
          updatedAt: new Date()
        },], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('salas', null, {});
  }
};
