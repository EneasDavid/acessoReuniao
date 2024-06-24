const dataSource = require('../models');

class Services {
    constructor(nomeDoModel, validador) {
        this.model = nomeDoModel;
        this.validador = validador;
    }

    async salvarErro(exception, mensagem, tabelaRelacionada, funcaoRelacionada) {
        const erro = {
            exception: exception,
            mensage: mensagem,
            tabelaRelacionada: tabelaRelacionada,
            funcaoRelacionada: funcaoRelacionada,
        };
        try {
            await dataSource.Fracaso.create(erro);
            console.log('Erro salvo com sucesso');
        } catch (error) {
            console.error('Falha ao salvar o erro no banco de dados:', error);
        }
    }

    async validarDados(dados) {
        try {
            this.validador.parse(dados);
        } catch (error) {
            const invalidFields = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
            const errorMessage = `Dados inválidos: ${invalidFields}`;
            throw new Error(errorMessage);
        }
    }

    async pegaTodosOsRegistros() {
        try {
            return await dataSource[this.model].findAll();
        } catch (error) {
            await this.salvarErro(error.name, error.message, this.model, 'pegaTodosOsRegistros');
            throw error;
        }
    }

    async pegaUmRegistro(id) {
        try {
            return await dataSource[this.model].findOne({ where: { id } });
        } catch (error) {
            await this.salvarErro(error.name, error.message, this.model, 'pegaUmRegistro');
            throw error;
        }
    }

    async criaRegistro(dados) {
        try {
            await this.validarDados(dados);
            return await dataSource[this.model].create(dados);
        } catch (error) {
            await this.salvarErro(error.name, error.message, this.model, 'criaRegistro');
            throw error;
        }
    }

    async atualizaRegistro(dadosAtualizados, id) {
        const dadosExistentes = await this.pegaUmRegistro(id);
        if (!dadosExistentes) {
            const errorMessage = 'Registro não encontrado';
            await this.salvarErro('Not Found', errorMessage, this.model, 'atualizaRegistro');
            throw new Error(errorMessage);
        }

        const dadosParaAtualizar = {
            ...dadosExistentes.toJSON(),
            ...dadosAtualizados, 
            updatedAt: new Date(), 
        };
        await this.validarDados(dadosParaAtualizar);
        try {
            const resultadoAtualizacao = await dataSource[this.model].update(dadosParaAtualizar, { where: { id } });
            return  {status: 200, resultadoAtualizacao};
        } catch (error) {
            await this.salvarErro(error.name, error.message, this.model, 'atualizaRegistro');
            throw error;
        }
    }
    
    async deletaRegistro(id) {
        try {
            return await dataSource[this.model].destroy({ where: { id } });
        } catch (error) {
            await this.salvarErro(error.name, error.message, this.model, 'deletaRegistro');
            throw error;
        }
    }
}

module.exports = Services;
