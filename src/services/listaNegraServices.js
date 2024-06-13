const Services=require('./services.js');
const z=require('zod');

class ListaNegraServices extends Services{
    constructor(){
        super('ListaNegra', z.object({
            //.optional()
            idResponsavel: z.number().int({message:"O campo de id de responsavel só aceita valores naturais"}).positive({message:"O campo deid de responsavel necessita ser um numero inteiro positivo"}),
            idReservaMotivo:z.number().int({message:"O campo de id de reserva só aceita valores naturais"}).positive({message:"O campo de id de reservaMotivo necessita ser um numero inteiro positivo"}),
            codBloqueio:z.string().length(10,{message: "o campo codigo de boqueio é formado por 10 caracteres" }),
            motivo:z.string().min(5,{message:"o campo motivo necessita de NO MINIMO 5 caracteres"}).max(255,{mensage:"o campo motivo necessita de NO MAXIMO 255 caracteres"}),
            dataBloqueio:z.string().date({message:"O campo dataBloqueio necessita do time yyyy-mm-dd"}),
        }));
    }

    async gerarCodigoBloqueio(){
        return Math.random().toString(36).substr(2, 10);
    }

    async criaRegistro(novoRegistro){
        try{
            const dataBloqueio = new Date();
            novoRegistro.dataBloqueio = dataBloqueio.toISOString().split('T')[0];
            codBloqueio = await this.gerarCodigoBloqueio();
            novoRegistro.codBloqueio = codBloqueio;
            return await this.criaRegistro(novoRegistro);
        }catch(error){
            await this.salvarErro(error.name, error.message, 'ListaNegra', 'criaRegistro');
            throw error;
        }
    }
}

module.exports=ListaNegraServices;