'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sala extends Model {
    static associate(models) {
      Sala.hasMany(models.Reserva, {
        foreignKey: 'idSala',
        as: 'reservas',
        onDelete: 'SET NULL', 
        hooks: true 
      });
      Sala.hasMany(models.EstadoSala, {
        foreignKey: 'idSala',
        as: 'estados',
        onDelete: 'SET NULL', 
        hooks: true 
      });
    }
  }
  Sala.init({
    nome: DataTypes.STRING,
    andar: DataTypes.INTEGER,
    area: DataTypes.STRING,
    capMax: DataTypes.INTEGER,
    situacao: DataTypes.CHAR,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Sala',
    tableName: 'salas'
  });
  return Sala;
};