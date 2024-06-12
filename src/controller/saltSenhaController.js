const Controller = require('./controller.js');
const HashServices = require('../services/saltSenha.js');
const hashServices = new HashServices();

class HashController extends Controller {
    constructor() {
        super(hashServices);
    }

    async gerarCaracteres(req, res){
        try{
            const caracteres = await hashServices.gerarCaracteres();
            return res.status(200).json(caracteres);
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Hash', method:'gerarCaracteres'});
        }
    }

    async gerarHash(req, res){
        const {senhaSalted} = req.body;
        try{
            const hash = await hashServices.gerarHash(senhaSalted);
            return res.status(200).json(hash);
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Hash', method:'gerarHash'});
        }
    }

    async buscarSalt(req, res){
        const {idRecepcionista} = req.params;
        try{
            const salt = await hashServices.buscarSalt(idRecepcionista);
            return res.status(200).json(salt);
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Hash', method:'buscarSalt'});
        }
    }

    async verificarSenha(req, res){
        const {senha, senhaHashed, idRecepcionista} = req.body;
        try{
            const bool = await hashServices.verificarSenha(senha, senhaHashed, idRecepcionista);
            return res.status(200).json(bool);
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:'Hash', method:'verificarSenha'});
        }
    }
}
module.exports = HashController;