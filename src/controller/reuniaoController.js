const Controller=require('./controller.js');
const ReuniaoServices=require('../services/reuniaoServices.js');
const reuniaoServices=new ReuniaoServices();

class ReuniaoController extends Controller{
    constructor(){
        super(reuniaoServices,{
            mensagemNaoEncontrado:'Reuniao não encontrada',
            mensagemJaExiste:'Já existe uma reuniao com esses dados'
        });
    }
}

module.exports=ReuniaoController;