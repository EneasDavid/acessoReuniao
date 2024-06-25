const Controller=require('./controller.js');
const SalaServices=require('../services/salaServices.js');
const salaServices=new SalaServices();

class SalaController extends Controller{
    constructor(){
        super(salaServices,{
            mensagemNaoEncontrado:'Sala não encontrada',
            mensagemJaExiste:'Já existe uma sala com esses dados'
        });
    }
}
module.exports=SalaController;