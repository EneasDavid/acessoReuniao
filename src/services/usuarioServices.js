const Services=require('./services.js');
const z=require('zod');
const dataSource = require('../models/index.js');

class UsuarioServices extends Services{
    constructor(){
        super('Usuario',z.object({
            identificador:z.string().min(11).max(11),
            nome:z.string().min(5,{message:"o campo nome necessita de NO MINIMO 5 caracteres"}).max(255,{message:"o campo nome necessita de NO MAXIMO 255 caracteres"}),
            sobrenome:z.string().min(5,{message:"o campo sobrenome necessita de NO MINIMO 5 caracteres"}).max(255,{message:"o campo sobrenome necessita de NO MAXIMO 255 caracteres"}),
            email:z.string().email({message:"o campo email necessita ser um email valido"}),
            numTelefone:z.string().min(11).max(11),
            dataNascimento:z.string().date(),
        }));
    }
    async consularUsuario(cpf, aniversario){
        try{
            return await this.UsuariofindOne({identificador:cpf, dataNascimento:aniversario});
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Usuario', 'consularUsuario');
            throw error;
        }
    }
}

module.exports=UsuarioServices;