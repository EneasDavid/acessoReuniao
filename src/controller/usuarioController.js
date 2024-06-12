const Controller=require('./controller.js');
const UsuarioServices=require('../services/usuarioServices.js');
const usuarioServices=new UsuarioServices();

class UsuarioController extends Controller{
    constructor(){
        super(usuarioServices);
    }
}

module.exports=UsuarioController;