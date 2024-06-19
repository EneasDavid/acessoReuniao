'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Reserva, {
        foreignKey: 'idUsuario',
        as: 'reservas',
        onDelete: 'SET NULL', 
        hooks: true 
      });
    }
  }
  Usuario.init({
    identificador: DataTypes.STRING,
    nome: DataTypes.STRING,
    sobrenome: DataTypes.STRING,
    email: DataTypes.STRING,
    numTelefone: DataTypes.STRING,
    dataNascimento: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios'
  });
  return Usuario;
};
