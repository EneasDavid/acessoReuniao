const Services=require('./services.js');
const z=require('zod');

class EstadoSalaServices extends Services{
    constructor(){
        super('EstadoSala', z.object({
            idSala:z.number().int({message:"O campo de id de sala só aceita valores naturais"}).positive({message:"O campo id de sala necessita ser um numero inteiro positivo"}),
        }));
    }
}

module.exports=EstadoSalaServices;