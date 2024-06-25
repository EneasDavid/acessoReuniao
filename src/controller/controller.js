class Controller{
    constructor(entidadeService, entidadeMsg = {} ) {
        this.entidadeService = entidadeService;
        this.entidadeMsg = entidadeMsg;
    }
    
    async pegaTodos(req, res) {
        try {
            const listaDeRegistro = await this.entidadeService.pegaTodosOsRegistros();
            switch(listaDeRegistro.status){
                case 404: 
                    return res.status(404).json({message: this.entidadeMsg.mensagemNaoEncontrado || 'Nenhum registro encontrado'});
                case 200: 
                    return res.status(200).json(listaDeRegistro);
            }            
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:this.entidadeService, method:'pegaTodos'});
        }
    }
    
    async cria(req, res) {
        const novoRegistro = req.body;
        try{
            const novoRegistroCriado = await this.entidadeService.criaRegistro(novoRegistro);
            switch(novoRegistroCriado.status){
                case 409:
                    return res.status(409).json({message: this.entidadeMsg.mensagemJaExiste || 'Já existe um registro com esses dados'});
                case 201:
                    return res.status(201).json(novoRegistroCriado);
            }
        }catch(erro){
            if (erro.error) {
                return res.status(400).json({error:erro.name, message:erro.message, model:this.entidadeService, method:'cria'});
            } else {
                return res.status(500).json({error:erro.name, message:erro.message, model:this.entidadeService, method:'cria'});
            }
        }
    }
    
    async atualiza(req,res){
        const id = req.params.id;
        const dadosNovos = req.body;
        try{
            const foiAtualizado = await this.entidadeService.atualizaRegistro(dadosNovos,Number(id));
            switch(foiAtualizado.status){
                case 409:
                    return res.status(409).json({message: this.entidadeMsg.mensagemJaExiste || 'Já existe um registro com esses dados'});
                case 404:
                    return res.status(404).json({message: this.entidadeMsg.mensagemNaoEncontrado || 'Registro não encontrado'});
                case 200:
                    return res.status(200).json(foiAtualizado);
            }
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:this.entidadeService, method:'atualiza'});
        }
    }
    
    async deleta(req,res){
        const id = req.params.id;
        try{
            const foiDeletado = await this.entidadeService.deletaRegistro(Number(id));
            switch(foiDeletado.status){
                case 404:
                    return res.status(404).json({message: this.entidadeMsg.mensagemNaoEncontrado || 'Registro não encontrado'});
                case 200:
                    return res.status(200).json(foiDeletado);
            }
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:this.entidadeService, method:'deleta'});
        }
    }
    
    async pegaPorId(req, res) {
        const id = req.params.id;
        try {
            const registro = await this.entidadeService.pegaUmRegistro(Number(id));
            switch(registro.status){
                case 404:
                    return res.status(404).json({message: this.entidadeMsg.mensagemNaoEncontrado || 'Registro não encontrado'});
                case 200:
                    return res.status(200).json(registro);
            }
        }catch(erro){
            return res.status(500).json({error:erro.name, message:erro.message, model:this.entidadeService, method:'pegaPorId'});
        }
    }
}

module.exports = Controller;