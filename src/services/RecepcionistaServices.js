const Services=require("./services.js");
const dataSource = require('../models/index.js');
const z=require('zod');
const { Sequelize } = require('sequelize');
const crypto = require('crypto');

class recepcionistaServices extends Services{
    constructor(){
        super('Recepcionista',z.object({
            login:z.string().min(5,{message:"O campo de login necessita de NO MINIMO 5 caracteres"}).max(255,{message:"O campo de login necessita de NO MAXIMO 255 caracteres"}),
            senha:z.string().min(8,{message:"O campo de senha necessita de NO MINIMO 8 caracteres"}).max(255,{message:"O campo de senha necessita de NO MAXIMO 255 caracteres"}),
            nome:z.string().min(5,{message:"O campo de nome necessita de NO MINIMO 5 caracteres"}).max(255,{message:"O campo de nome necessita de NO MAXIMO 255 caracteres"}),
            sobrenome:z.string().min(5,{message:"O campo de sobrenome necessita de NO MINIMO 5 caracteres"}).max(255,{message:"O campo de sobrenome necessita de NO MAXIMO 255 caracteres"}),
            ativo:z.boolean(),
            nivelAcesso:z.number().int({message:"O campo de nivel de acesso necessita ser um numero inteiro"}).positive({message:"O campo de nivel de acesso necessita ser um numero inteiro positivo"}),
        }));
    }

    async gerarCaracteres(){
        let result = '';
        for(let i = 0; i < 30; i++){
            let ascii = Math.floor(Math.random() * 256);
            result += String.fromCharCode(ascii);
        }
        return result;
    }
    
    async fazerSalt(senha){
        let salt = await this.gerarCaracteres();
        let salted = salt + senha;
        return { salt, salted };
    }

    async fazerHash(senhaSalted){
        let hash = crypto.createHash('sha256');
        hash.update(senhaSalted);
        return hash.digest('hex');
    }
    
    async fazerMatch(senha, salt, storedHash){
        let salted = salt + senha;
        let hashed = await this.fazerHash(salted);
        return hashed === storedHash;
    }

    async criarRecepcioninsta(novoRegistro){
        try{
            let salt = await this.gerarCaracteres();
            let salted = salt + novoRegistro.senha;
            let hashed = await this.fazerHash(salted);
            novoRegistro.senha = salt + hashed;
            return await dataSource.Recepcionista.create(novoRegistro);
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Recepcionista', 'criaRecepcioninsta');
            throw error;
        }
    }
    
    async buscarUsuario(login) {
    return await dataSource.Recepcionista.findOne({ where: { login: { [Sequelize.Op.eq]: login }}});
    }

    async verificarSenha(senha, senhaHashed) {
        let salt = senhaHashed.substring(0, 30);
        let storedHash = senhaHashed.substring(30);
        return await this.fazerMatch(senha, salt, storedHash);
    }

    async login(login, senha) {
        try{
            let usuario = await this.buscarUsuario(login);
            if (!usuario) throw new Error('Usuário não encontrado');

            let senhaValida = await this.verificarSenha(senha, usuario.senha);
            if (!senhaValida) throw new Error('Senha incorreta');

            return usuario;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Recepcionista', 'login');
            throw error;
        }
    }
}

module.exports=recepcionistaServices;