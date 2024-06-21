const Controller=require('./controller.js');
const UsuarioServices=require('../services/usuarioServices.js');
const usuarioServices=new UsuarioServices();

class UsuarioController extends Controller{
    constructor(){
        super(usuarioServices);
    }
    async consultarUsuario(req, res) {
        const { identificador, dataNascimento } = req.params;
        console.log(identificador, dataNascimento);
        try {
          const response = await usuarioServices.consultarUsuario(identificador, dataNascimento);
          if (response) return res.status(200).json(response);
          else return res.status(404).json({ message: 'Usuário não encontrado' });
        } catch (error) {
          return res.status(500).json({ error: error.name, message: error.message, model: 'Usuario', method: 'consultarUsuario' });
        }
    }
}

module.exports=UsuarioController;