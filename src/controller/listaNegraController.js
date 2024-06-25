const Controller=require('./controller.js');
const ListaNegraServices=require('../services/listaNegraServices.js');
const listaNegraServices=new ListaNegraServices();

class ListaNegraController extends Controller{
    constructor(){
        super(listaNegraServices,{
            mensagemNaoEncontrado:'Registro não encontrado',
            mensagemJaExiste:'Já existe um registro com esses dados'
        });
    }

    async criar(req, res){
        const novoRegistro = req.body;
        try{
            const novoRegistroCriado = await listaNegraServices.criar(novoRegistro);
            switch(novoRegistroCriado.status){
                case 201:
                    return res.status(201).json(novoRegistroCriado);
            }
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Lista Negra', method:'cria'});
        }
    }
}
module.exports=ListaNegraController;