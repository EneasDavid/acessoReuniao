const Services=require("./services.js");
const dataSource = require('../models/index.js');
const z=require('zod');
const { Sequelize } = require('sequelize');
const crypto = require('crypto');

class recepcionistaServices extends Services{
    constructor(){
        super('Recepcionista',z.object({
            login:z.string().min(5,{message:"O campo de login necessita de NO MINIMO 5 caracteres"}).max(255,{message:"O campo de login necessita de NO MAXIMO 255 caracteres"}),
            senha:z.string().min(38,{message:"O campo de senha necessita de NO MINIMO 8 caracteres"}).max(255,{message:"O campo de senha necessita de NO MAXIMO 255 caracteres"}),
            nome:z.string().min(5,{message:"O campo de nome necessita de NO MINIMO 5 caracteres"}).max(255,{message:"O campo de nome necessita de NO MAXIMO 255 caracteres"}),
            sobrenome:z.string().min(5,{message:"O campo de sobrenome necessita de NO MINIMO 5 caracteres"}).max(255,{message:"O campo de sobrenome necessita de NO MAXIMO 255 caracteres"}),
            ativo:z.boolean(),
            nivelAcesso:z.number().int({message:"O campo de nivel de acesso necessita ser um numero inteiro"}).positive({message:"O campo de nivel de acesso necessita ser um numero inteiro positivo"}),
        }));
    }

    async gerarCaracteres(){
        return Array.from(crypto.randomBytes(30), byte => String.fromCharCode(byte)).join('');
    }

    async fazerHash(senhaSalted){
        let hash = crypto.createHash('sha256');
        hash.update(senhaSalted);
        return hash.digest('hex');
    }
    
    async criarRecepcionista(novoRegistro){
        try{
            let salt = await this.gerarCaracteres();
            let hashed = await this.fazerHash(salt + novoRegistro.senha);
            novoRegistro.senha = hashed;
            let novoRecepcionista = await dataSource.Recepcionista.create(novoRegistro);
            await dataSource.saltSenha.create({ idRecepcionista: novoRecepcionista.id, salt: salt });
            return novoRecepcionista;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Recepcionista', 'criaRecepcioninsta');
            throw error;
        }
    }

    async buscarUsuario(login){
        return await dataSource.Recepcionista.findOne({ where: { login: { [Sequelize.Op.eq]: login }}});
    }
    
    async buscarSalt(idRecepcionista){
        let saltSenha = await dataSource.saltSenha.findOne({ where: { idRecepcionista: { [Sequelize.Op.eq]: idRecepcionista }}});
        return saltSenha ? saltSenha.salt : null;
    }
    
    async verificarSenha(senha, senhaHashed, idRecepcionista){
        let salt = await this.buscarSalt(idRecepcionista);
        if (!salt) throw new Error('Salt não encontrado');
        let hashed = await this.fazerHash(salt + senha);
        return hashed === senhaHashed;
    }
    
    async login(login, senha){
        try{
            let usuario = await this.buscarUsuario(login);
            if (!usuario) throw new Error('Usuário não encontrado');
            let senhaValida = await this.verificarSenha(senha, usuario.senha, usuario.id);
            if (!senhaValida) throw new Error('Senha incorreta');
            return usuario;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Recepcionista', 'login');
            throw error;
        }
    }
}

module.exports=recepcionistaServices;