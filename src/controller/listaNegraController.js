const Controller=require('./controller.js');
const ListaNegraServices=require('../services/listaNegraServices.js');
const listaNegraServices=new ListaNegraServices();

class ListaNegraController extends Controller{
    constructor(){
        super(listaNegraServices);
    }
}
module.exports=ListaNegraController;