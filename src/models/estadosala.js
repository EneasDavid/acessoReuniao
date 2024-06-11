'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EstadoSala extends Model {
    static associate(models) {
      EstadoSala.belongsTo(models.Sala, {
        foreignKey: 'idSala',
        onDelete: 'CASCADE',
      });
    }
  }
  EstadoSala.init({
    observacao: DataTypes.STRING,
    idSala: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'EstadoSala',
    tableName: 'estadoSalas'
  });
  return EstadoSala;
};