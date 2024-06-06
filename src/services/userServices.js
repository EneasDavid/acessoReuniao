const Services = require('./services.js');
const dataSource = require('../models/index.js');
const z=require('zod');
const { Sequelize } = require('sequelize');

class UserServices extends Services {
    constructor() {
        super('User', z.object({
            login: z.string().min(4).max(20),
            senha: z.string().min(10).max(56),
            identificador: z.string().min(11).max(14),
            ativo: z.boolean(),
            tipo: z.number().int().nonnegative(),
            nivelAcesso: z.number().int().positive(),
        }));
    }

    async salvarErro(exception, mensagem) {
        const erro = {
            exception: exception,
            message: mensagem,
        };
        try {
            await dataSource.Fracaso.create(erro);
            console.log('Erro salvo com sucesso');
        } catch (error) {
            console.error('Falha ao salvar o erro no banco de dados:', error);
        }
    }

    async login(login, senha) {
        try{
            return dataSource.User.findOne({ where: { login: { [Sequelize.Op.eq]: login }, senha: { [Sequelize.Op.eq]: senha }}});
        }catch(error){
            await this.salvarErro(error.name, error.message);
            throw error;
        }
    }
}

module.exports = UserServices;