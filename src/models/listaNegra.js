'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListaNegra extends Model {
    static associate(models) {
      ListaNegra.belongsTo(models.Usuario, {
        foreignKey: 'idResponsavel',
        as: 'usuario',
        onDelete: 'SET NULL', 
        hooks: true 
      });
      ListaNegra.belongsTo(models.Reserva, {
        foreignKey: 'idReservaMotivo',
        as: 'reserva',
        onDelete: 'SET NULL', 
        hooks: true 

      });
    }
  }
  ListaNegra.init({
    idResponsavel: DataTypes.INTEGER,
    idReservaMotivo: DataTypes.INTEGER,
    codBloqueio: DataTypes.STRING,
    motivo: DataTypes.STRING,
    dataBloqueio: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ListaNegra',
    tableName: 'listaNegras'
  });
  return ListaNegra;
};