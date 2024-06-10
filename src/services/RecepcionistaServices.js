const Services=require("./services.js");
const hashServices=require("./hashServices.js")
const z=require('zod');
const jwt=require('jsonwebtoken');

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
        this.hashService = new hashServices();
    }

    async criarRecepcionista(novoRegistro){
        try{
            let salt = await this.hashService.gerarCaracteres();
            let hashed = await this.hashService.gerarHash(salt + novoRegistro.senha);
            novoRegistro.senha = hashed;
            let novoRecepcionista = await this.criaRegistro(novoRegistro);
            await this.criaRegistro({ idRecepcionista: novoRecepcionista.id, salt: salt });
            return novoRecepcionista;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Recepcionista', 'criaRecepcioninsta');
            throw error;
        }
    }
    
    async login(login, senha){
        try{
            let usuario = await this.pegaUmRegistro(login);
            let senhaValida = await this.hashService.verificarSenha(senha, usuario.senha, usuario.id);
            if(!usuario || !senhaValida) throw new Error('Login ou senha inválidos');
            //ALterar para inserir o token
            //let token = await this.gerarToken(usuario.id);
            return true;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Recepcionista', 'login');
            throw error;
        }
    }
}

module.exports=recepcionistaServices;