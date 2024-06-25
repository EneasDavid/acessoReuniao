const Controller=require('./controller.js');
const RecepcionistaServices=require('../services/recepcionistaServices.js');
const recepcionistaServices=new RecepcionistaServices();

class RecepcionistaController extends Controller{
    constructor(){
        super(recepcionistaServices,{
            mensagemNaoEncontrado:'Recepcionista não encontrado',
            mensagemJaExiste:'Já existe um recepcionista com esses dados'
        });
    }

    async cria(req, res){
        const novoRegistro = req.body;
        try{
            const novoRegistroCriado = await recepcionistaServices.criarRecepcionista(novoRegistro);
            switch (novoRegistroCriado.status) {
                case 409:
                    return res.status(409).json({ message: 'Login já existe' });
                case 201: 
                    return res.status(201).json(novoRegistroCriado);
            }
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Recepcionista', method:'cria'});
        }
    }
    
    async login(req, res) {
        const { login, senha } = req.body;
        try {
            const response = await recepcionistaServices.login(login, senha);
            switch (response.status) {
                case 401: 
                    return res.status(401).json({ message: 'Usuário ou senha incorretos' });
                case 403:
                    return res.status(403).json({ message: 'Usuário inativo, não tem acesso ao sistema no momento, fale com seu superior' });
                case 200:
                    return res.status(200).json(response);
                default:
                    return res.status(404).json({ message: 'Recepcionista não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            return res.status(500).json({ error: error.name, message: error.message });
        }
    }
    
}

module.exports=RecepcionistaController;