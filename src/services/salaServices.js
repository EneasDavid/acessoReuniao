const Services=require('./services.js');
const z=require('zod');

class salaServices extends Services{
    constructor(){
        super('Sala',z.object({
            nome:z.string().min(2,{message:"o campo nome necessita de NO MINIMO 2 caracteres"}).max(255,{message:"o campo nome necessita de NO MAXIMO 255 caracteres"}),
            andar:z.number().int().positive({message:"o campo capMax andar ser um numero inteiro positivo"}),
            area:z.string().min(4,{message:"o campo area necessita de NO MINIMO 4 caracteres"}).max(255,{message:"o campo area necessita de NO MAXIMO 255 caracteres"}),
            capMax:z.number().int().positive({message:"o campo capMax necessita ser um numero inteiro positivo"}),
            situacao:z.string().length(1).optional(),
        }));
    }
}
module.exports=salaServices;