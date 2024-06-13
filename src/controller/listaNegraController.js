const Controller=require('./controller.js');
const ListaNegraServices=require('../services/listaNegraServices.js');
const listaNegraServices=new ListaNegraServices();

class ListaNegraController extends Controller{
    constructor(){
        super(listaNegraServices);
    }

    async criar(req, res){
        const novoRegistro = req.body;
        try{
            const novoRegistroCriado = await listaNegraServices.criar(novoRegistro);
            return res.status(200).json(novoRegistroCriado);
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Lista Negra', method:'cria'});
        }
    }
}
module.exports=ListaNegraController;