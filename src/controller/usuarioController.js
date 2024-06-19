const Controller=require('./controller.js');
const UsuarioServices=require('../services/usuarioServices.js');
const usuarioServices=new UsuarioServices();

class UsuarioController extends Controller{
    constructor(){
        super(usuarioServices);
    }
    async consularUsuario(req, res){
        const {indentificador, dataAniversario}=req.body;
        try{
            const response=await usuarioServices.consularUsuario(indentificador, dataAniversario);
            if(response) return res.status(200).json(response);
            return res.status(404).json({message:'Usario não encontrado'});
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Usuario', method:'consularUsuario'});
        }

    }
}

module.exports=UsuarioController;