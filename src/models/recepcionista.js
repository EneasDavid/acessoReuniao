'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recepcionista extends Model {
    static associate(models) {
      Recepcionista.hasMany(models.Reserva, {
        foreignKey: 'idRecepcionista',
        as: 'reservas'
      });
      Recepcionista.belongsTo(models.NivelAcesso, {
        foreignKey: 'nivelAcesso',
        as: 'nivelAcessos'
      });
      Recepcionista.hasOne(models.saltSenha, {
        foreignKey: 'idRecepcionista',
        as: 'saltSenha',
        onDelete: 'CASCADE'
      });
    }
  }
  Recepcionista.init({
    login: DataTypes.STRING,
    senha: DataTypes.STRING,
    nome: DataTypes.STRING,
    sobrenome: DataTypes.STRING,
    ativo: DataTypes.BOOLEAN,
    nivelAcesso: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Recepcionista',
    tableName: 'recepcionistas'
  });
  return Recepcionista;
};