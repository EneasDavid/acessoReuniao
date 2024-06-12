'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /*
    await queryInterface.bulkInsert('recepcionistas', [
       //Removidos por conta dos metodos de segurança atraves do login
      {
        login: 'garota de ipanema',
        senha: 'quase me chamou de amor',
        nome:'Bruna',
        sobrenome:'Castro',
        ativo: true,
        nivelAcesso: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        login: 'chefion',
        senha: 'culpado de amor',
        nome:'Ulpio',
        sobrenome:'Neto',
        ativo: true,
        nivelAcesso: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
    ], {});
    */
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recepcionistas', null, {});
  }
};
