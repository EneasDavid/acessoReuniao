const Services=require("./services.js");
const crypto = require('crypto');
const z=require('zod');
const hash=require("../models").saltSenha;

class hashServices extends Services{
    constructor(){
        super('saltSenha', z.object({
            idRecepcionista: z.number("O id do recepcionista não pode ser um valor não numerico").positive("O id do recepcionista não pode ser um valor negativo"),
            salt: z.string().min(30,"O tamanho minino dev ser de 30 caracteres").max(30,"P tamanho maximo deve ser de 30 caracteres"),
        }));
    }

    async gerarCaracteres(){
        return Array.from(crypto.randomBytes(30), byte => String.fromCharCode(byte)).join('');
    }

    async gerarHash(senhaSalted){
        try{
            let hash = crypto.createHash('sha256');
            hash.update(senhaSalted);
            return hash.digest('hex');
        }catch(error){
            await this.salvarErro(error.name, error.message, 'SaltSenha', 'gerarHash');
            throw error;
        }
    }
    
    async buscarSalt(idRecepcionista){
        try{
            let saltSenha = await hash.findOne({where:{idRecepcionista}});
            return saltSenha ? saltSenha.salt : null;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'SaltSenha', 'buscarSalt');
            throw error;
        }
    }

    async verificarSenha(senha, senhaHashed, idRecepcionista){
        try{
            console.log(idRecepcionista);
            let salt = await this.buscarSalt(idRecepcionista);
            console.log(salt);
            if (!salt) throw new Error('Salt não encontrado');
            let hashed = await this.gerarHash(salt + senha);
            return hashed === senhaHashed;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'SaltSenha', 'verificarSenha');
            throw error;
        }
    }


}
module.exports = hashServices;