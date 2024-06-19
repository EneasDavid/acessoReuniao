'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NivelAcesso extends Model {
    static associate(models) {
      NivelAcesso.hasMany(models.Recepcionista, {
        foreignKey: 'nivelAcesso',
        as: 'recepcionistas',
        onDelete: 'SET NULL', 
        hooks: true 
      });
    }
  }
  NivelAcesso.init({
    nivelAcesso: DataTypes.INTEGER,
    glossarioNivel: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'NivelAcesso',
    tableName: 'nivelAcessos'
  });
  return NivelAcesso;
};