const Services=require("./services.js");
const crypto = require('crypto');
const z=require('zod');

class hashServices extends Services{
    constructor(){
        super('Hash', z.object({
            idRecepcionista: z.number("O id do recepcionista não pode ser um valor não numerico").positive("O id do recepcionista não pode ser um valor negativo"),
            salt: z.string().min(30,"O tamanho minino dev ser de 30 caracteres").max(30,"P tamanho maximo deve ser de 30 caracteres"),
        }));
    }

    async gerarCaracteres(){
        return Array.from(crypto.randomBytes(30), byte => String.fromCharCode(byte)).join('');
    }

    async gerarHash(senhaSalted){
        let hash = crypto.createHash('sha256');
        hash.update(senhaSalted);
        return hash.digest('hex');
    }
    
    async buscarSalt(idRecepcionista){
        let saltSenha = await this.pegaUmRegistro(idRecepcionista);
        return saltSenha ? saltSenha.salt : null;
    }

    async verificarSenha(senha, senhaHashed, idRecepcionista){
        let salt = await this.buscarSalt(idRecepcionista);
        if (!salt) throw new Error('Salt não encontrado');
        let hashed = await this.gerarHash(salt + senha);
        return hashed === senhaHashed;
    }


}
module.exports = hashServices;