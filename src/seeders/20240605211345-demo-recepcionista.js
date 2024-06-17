'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports={
  async up (queryInterface, Sequelize) {
    const HashServices=require("../services/saltSenha.js")
    const hashService = new HashServices();
    const recepcionistas=[
      {
        login: 'garota de ipanema',
        senha: 'quase me chamou de amor',
        nome:'Bruna',
        sobrenome:'Castro',
        ativo: true,
        nivelAcesso: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        login: 'chefion',
        senha: "e aí bê",
        nome:'Ulpio',
        sobrenome:'Neto',
        ativo: true,
        nivelAcesso: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const recepcionista of recepcionistas) {
      let salt = await hashService.gerarCaracteres();
      let hashed = await hashService.gerarHash(salt + recepcionista.senha);
      recepcionista.senha = hashed;
      recepcionista.salt = salt;
    }

    await queryInterface.bulkInsert('recepcionistas', recepcionistas.map(r => {
      return {
        login: r.login,
        senha: r.senha,
        nome: r.nome,
        sobrenome: r.sobrenome,
        ativo: r.ativo,
        nivelAcesso: r.nivelAcesso,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      };
    }), {});

    const salts=recepcionistas.map((r, index) => {
      return{
        idRecepcionista:index+1,
        salt:r.salt,
        createdAt:new Date(),
        updatedAt:new Date()
      };
    });

    await queryInterface.bulkInsert('saltSenhas', salts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('saltSenhas', null, {});
    await queryInterface.bulkDelete('recepcionistas', null, {});
  }
};
