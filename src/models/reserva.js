'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reserva extends Model {
    static associate(models) {
      Reserva.belongsTo(models.Sala, {
        foreignKey: 'idSala',
        as: 'salas',
        onDelete: 'SET NULL', 
        hooks: true 
      });
      Reserva.belongsTo(models.Usuario, {
        foreignKey: 'idUsuario',
        as: 'usuarios',
        onDelete: 'SET NULL', 
        hooks: true 
      });
      Reserva.belongsTo(models.Recepcionista, {
        foreignKey: 'idRecepcionista',
        as: 'recepcionistas',
        onDelete: 'SET NULL', 
        hooks: true 
      });
    }
  }
  Reserva.init({
    idSala: DataTypes.INTEGER,
    idUsuario: DataTypes.INTEGER,
    idRecepcionista: DataTypes.INTEGER,
    dataReservada: DataTypes.STRING,
    horaInicio: DataTypes.STRING,
    horaFimReserva:  DataTypes.STRING,
    statusReserva: DataTypes.STRING,
    dataModificacaoStatus: DataTypes.STRING,
    motivoReserva: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reserva',
    tableName: 'reservas'
  });
  return Reserva;
};