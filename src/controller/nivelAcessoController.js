const Controller=require('./controller.js');
const NivelAcessoServices=require('../services/nivelAcessoServices.js');
const nivelAcessoServices=new NivelAcessoServices();

class NivelAcessoController extends Controller{
    constructor(){
        super(nivelAcessoServices);
    }
}

module.exports=NivelAcessoController;