const Services=require('./services.js');
const z=require('zod');
const dataSource = require('../models/index.js');

class UsuarioServices extends Services{
    constructor(){
        super('Usuario',z.object({
            identificador:z.string().min(11).max(11),
            nome:z.string().min(3,{message:"o campo nome necessita de NO MINIMO 3 caracteres"}).max(255,{message:"o campo nome necessita de NO MAXIMO 255 caracteres"}),
            sobrenome:z.string().min(2,{message:"o campo sobrenome necessita de NO MINIMO 2 caracteres"}).max(255,{message:"o campo sobrenome necessita de NO MAXIMO 255 caracteres"}),
            email:z.string().email({message:"o campo email necessita ser um email valido"}),
            numTelefone:z.string().min(11).max(11),
            dataNascimento:z.string(),
        }));
    }
    async consultarUsuario(identificador, dataNascimento) {
        try {
            let user=await dataSource.Usuario.findOne({where:{identificador}});
            if(!user) return {status: 404 };
            else if(user.dataNascimento!==dataNascimento){
                this.salvarErro('Data de nascimento invalida', 'A data de nascimento informada não corresponde a data de nascimento do usuario', 'Usuario', 'consultarUsuario');
                return { status: 401 };
            }
            return {status: 200, user};
        } catch (error) {
          await this.salvarErro(error.name, error.message, 'Usuario', 'consultarUsuario');
          throw error;
        }
      }
}

module.exports=UsuarioServices;