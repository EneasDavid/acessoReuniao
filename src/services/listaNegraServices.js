const Services = require('./services.js');
const z = require('zod');
const dataSource = require('../models/index.js');

class ListaNegraServices extends Services {
    constructor() {
        super('ListaNegra', z.object({
            idResponsavel: z.number().int({ message: "O campo de id de responsavel só aceita valores naturais" }).positive({ message: "O campo de id de responsavel necessita ser um numero inteiro positivo" }),
            idReservaMotivo: z.number().int({ message: "O campo de id de reserva só aceita valores naturais" }).positive({ message: "O campo de id de reservaMotivo necessita ser um numero inteiro positivo" }),
            codBloqueio: z.string().length(10, { message: "o campo codigo de bloqueio é formado por 10 caracteres" }),
            motivo: z.string().min(5, { message: "o campo motivo necessita de NO MINIMO 5 caracteres" }).max(255, { message: "o campo motivo necessita de NO MAXIMO 255 caracteres" }),
            dataBloqueio: z.string().refine(value => /\d{4}-\d{2}-\d{2}/.test(value), { message: "O campo dataBloqueio necessita do time yyyy-mm-dd" }),
            estadoBloqueio: z.boolean(),
        }));
    }

    async gerarCodigoBloqueio() {
        return Math.random().toString(36).slice(2, 12);
    }
    
    async criar(novoRegistro) {
        try {
            const dataBloqueio = new Date();
            novoRegistro.dataBloqueio = dataBloqueio.toISOString().split('T')[0];
            let codBloqueio=await this.gerarCodigoBloqueio();
            novoRegistro.codBloqueio = codBloqueio;
            return await this.criaRegistro(novoRegistro);
        } catch (error) {
            await this.salvarErro(error.name, error.message, 'ListaNegra', 'criaRegistro');
            throw error;
        }
    }
    async pegaTodosOsRegistros() {
        try {
            return await dataSource.ListaNegra.findAll({ where: { estadoBloqueio: true } });
        } catch (error) {
            await this.salvarErro(error.name, error.message, this.model, 'pegaTodosOsRegistros');
            throw error;
        }
    }
    
}

module.exports = ListaNegraServices;
