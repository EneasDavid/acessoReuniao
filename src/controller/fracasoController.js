const Controller=require('./controller.js');
const FracasoServices=require('../services/fracasoServices.js');
const fracasoServices=new FracasoServices();

class FracasoController extends Controller{
    constructor(){
        super(fracasoServices);
    }
}
module.exports=FracasoController;