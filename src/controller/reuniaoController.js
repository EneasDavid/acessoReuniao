const Controller=require('./controller.js');
const ReuniaoServices=require('../services/reuniaoServices.js');
const reuniaoServices=new ReuniaoServices();

class ReuniaoController extends Controller{
    constructor(){
        super(reuniaoServices);
    }
}

module.exports=ReuniaoController;