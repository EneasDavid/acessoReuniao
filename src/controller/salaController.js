const Controller=require('./controller.js');
const SalaServices=require('../services/salaServices.js');
const salaServices=new SalaServices();

class SalaController extends Controller{
    constructor(){
        super(salaServices);
    }
}
module.exports=SalaController;