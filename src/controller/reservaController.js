const Controller=require('./controller.js');
const ReservaServices=require('../services/reservaServices.js');
const reservaServices=new ReservaServices();

class ReservaController extends Controller {
    constructor() {
        super(reservaServices);
    }

    async reservasStatus(req, res){
        const situacao = req.params.status;
        try {
            const reservas = await reservaServices.reservaStatus(situacao);
            return res.status(200).json(reservas);
        } catch (erro) {
            return res.status(500).json({ error: erro.name, message: erro.message, model: 'Reserva', method: 'reservasStatus' });
        }
    }

    async verificaHorarioReservaExistente(req, res){
        const { idSala, dataReservada } = req.params;
        try {
            const response = await reservaServices.verificaHorarioReserva(idSala, dataReservada);
            switch (response.status){
                case 404:
                    return res.status(404).json({ message: 'Horário indisponível' });
                case 200:
                    return res.status(200).json(response.data);
            }
        } catch (erro) {
            return res.status(500).json({ error: erro.name, message: erro.message, model: 'Reserva', method: 'verificaHorarioReservaExistente' });
        }
    }

    async verificaDisponibilidade(req, res){
        const { idSala, dataReservada, horaReservada } = req.params;
        try {
            const response = await reservaServices.verificaDisponibilidade(idSala, dataReservada, horaReservada);
            switch (response.status) {
                case 404:
                    return res.status(404).json({ message: 'Sala indisponível' });
                case 200:
                    return res.status(200).json(response);
            }
        } catch (erro) {
            return res.status(500).json({ error: erro.name, message: erro.message, model: 'Reserva', method: 'verificaDisponibilidade' });
        }
    }

    async cria(req, res){
        const novoRegistro = req.body;
        try {
            const novoRegistroCriado = await reservaServices.criaRegistro(novoRegistro);
            switch (novoRegistroCriado.status) {
                case 409:
                    return res.status(409).json({ message: 'Conflito: A reserva já existe' });
                case 200:
                    return res.status(200).json(novoRegistroCriado.data);
                default:
                    return res.status(novoRegistroCriado.status).json({ message: 'Erro não esperado' });
            }
        } catch (error) {
            console.error('Erro ao criar registro:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
        
    }

    async atualizar(req, res){
        try {
            const id = req.params.id;
            const dadosAtualizados = req.body;
            const registroAtualizado = await reservaServices.atualizar(dadosAtualizados, id);
            switch (registroAtualizado.status){
                case 404:
                    return res.status(404).json({ message: 'Reserva não encontrada' });
                case 200:
                    return res.status(200).json(registroAtualizado);
            }
        } catch (erro) {
            return res.status(500).json({ error: erro.name, message: erro.message, model: 'Reserva', method: 'atualizar' });
        }
    }

    async concluirReserva(req, res){
        const id = req.params.id;
        try{
            const result = await reservaServices.concluirReserva(id);
            switch (result.status) {
                case 404:
                    return res.status(404).json({ message: 'Reserva não encontrada para conclusão' });
                case 200:
                    return res.status(200).json({ message: 'Reserva concluída com sucesso', data: result });
            }
        }catch(error){
            return res.status(500).json({ message: 'Erro ao concluir reserva', error: error.message });
        }
    }

    async cancelarReserva(req, res){
        const id = req.params.id;
        try{
            const result = await reservaServices.cancelarReserva(id);
            switch (result.status) {
                case 404:
                    return res.status(404).json({ message: 'Reserva não encontrada para cancelamento' });
                case 200:
                    return res.status(200).json({ message: 'Reserva cancelada com sucesso', data: result });
            }
        }catch(error){
            return res.status(500).json({ message: 'Erro ao cancelar reserva', error: error.message });
        }
    }

    async confirmarReserva(req, res){
        const id = req.params.id;
        try{
            const result = await reservaServices.confirmarReserva(id);
            switch (result.status) {
                case 404:
                    return res.status(404).json({ message: 'Reserva não encontrada para confirmação' });
                case 200:
                    return res.status(200).json({ message: 'Reserva confirmada com sucesso', data: result });
            }
        }catch(error){
            return res.status(500).json({ message: 'Erro ao confirmar reserva', error: error.message });
        }
    }
}

module.exports = ReservaController;