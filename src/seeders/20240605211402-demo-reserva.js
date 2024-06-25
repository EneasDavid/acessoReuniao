'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const ReservasServices=require("../services/reservaServices.js")
    const reservasServices = new ReservasServices();
    const [dataReservada, horaInicio]= await Promise.all([
      reservasServices.formatarData(new Date()), 
      reservasServices.formatarHora(new Date())]);
      const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');   
    const reservas=[{
      idSala: 1,
      idUsuario: 1,
      idRecepcionista: 1,
      dataReservada: dataReservada,
      horaInicio: horaInicio,
        horaFimReserva: await reservasServices.gerarHoraFim(`${horas}:${minutos}`,3),
      statusReserva: 'PENDENTE',
      dataModificacaoStatus:null,
      motivoReserva: 'estudo coletivo',      
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      idSala: 2,
      idUsuario: 2,
      idRecepcionista: 1,
      dataReservada: dataReservada,
      horaInicio: horaInicio,
      horaFimReserva: await reservasServices.gerarHoraFim(`${horas}:${minutos}`,3),
      statusReserva: 'PENDENTE',
      dataModificacaoStatus:null,
      motivoReserva: 'estudo coletivo',      
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      idSala: 3,
      idUsuario: 3,
      idRecepcionista: 1,
      dataReservada: dataReservada,
      horaInicio: horaInicio,
      horaFimReserva: await reservasServices.gerarHoraFim(`${horas}:${minutos}`,3),
      statusReserva: 'PENDENTE',
      dataModificacaoStatus:null,
      motivoReserva: 'estudo coletivo',      
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      idSala: 4,
      idUsuario: 1,
      idRecepcionista: 2,
      dataReservada: dataReservada,
      horaInicio: horaInicio,
      horaFimReserva: await reservasServices.gerarHoraFim(`${horas}:${minutos}`,3),
      statusReserva: 'PENDENTE',
      dataModificacaoStatus:null,      
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    await queryInterface.bulkInsert('reservas', reservas.map(r => {
      return {
        idSala: r.idSala,
        idUsuario: r.idUsuario,
        idRecepcionista: r.idRecepcionista,
        dataReservada: r.dataReservada,
        horaInicio: r.horaInicio,
        horaFimReserva: r.horaFimReserva,
        statusReserva: r.statusReserva,
        dataModificacaoStatus: r.dataModificacaoStatus,
        motivoReserva: r.motivoReserva,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      };
    }), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reservas', null, {});
  }
};
