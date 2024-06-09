'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saltSenha extends Model {
    static associate(models) {
      //models 
    }
  }
  saltSenha.init({
    idRecepcionista: DataTypes.INTEGER,
    salt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'saltSenha',
    tableName: 'saltSenhas'
  });
  return saltSenha;
};