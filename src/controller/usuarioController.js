const Controller=require('./controller.js');
const UsuarioServices=require('../services/usuarioServices.js');
const usuarioServices=new UsuarioServices();

class UsuarioController extends Controller{
    constructor(){
        super(usuarioServices,{
          mensagemNaoEncontrado:'Usuário não encontrado',
          mensagemJaExiste:'Já existe um usuário com esses dados'
        });
    }
    async consultarUsuario(req, res) {
        const { identificador, dataNascimento } = req.params;
        console.log(identificador, dataNascimento);

        try {
          const response = await usuarioServices.consultarUsuario(identificador, dataNascimento);
          switch (response.status) {
            case 401: 
              return res.status(401).json({ message: 'Data de nascimento inválida' });
            case 200:
              return res.status(200).json(response.user);
            default:
              return res.status(404).json({ message: 'Usuário não encontrado' });
          }
        } catch (error) {
          return res.status(500).json({ error: error.name, message: error.message, model: 'Usuario', method: 'consultarUsuario' });
        }
    }
}

module.exports=UsuarioController;