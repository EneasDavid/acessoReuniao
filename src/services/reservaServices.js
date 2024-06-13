const Services=require('./services.js');
const ListaNegraServices=require('./listaNegraServices.js');
const listaNegraServices = new ListaNegraServices();
const dataSource = require('../models/index.js');
const z=require('zod');

class ReservaServices extends Services{
    
    constructor(){
        super('Reserva',z.object({
            idSala:z.number().int({message:"O campo de idSala necessita ser um numero inteiro"}).positive({message:"O campo de idSala necessita ser um numero inteiro positivo"}),
            idUsuario:z.number().int({message:"O campo de idUsuario necessita ser um numero inteiro"}).positive({message:"O campo de idUsuario necessita ser um numero inteiro positivo"}),
            dataReservada:z.string().date({message:"O campo dataReservada necessita do time yyyy-mm-dd"}),
            horaInicio:z.string().time({message:"O campo horaInicio necessita do time hh:mm:ss"}),
            horaFimReserva:z.string().time({message:"O campo horaFimReserva necessita do time hh:mm:ss"}),
            statusReserva:z.string().length(1,{message:"o campo statusReserva necessita de apenas um caracter"}).toUpperCase(),
            dataModificacaoStatus:z.string().date({message:"O campo dataModificacaoStatus necessita do time yyyy-mm-dd"}),
            motivoReserva:z.string().min(5,{message:"o campo motivoReserva necessita de NO MINIMO 5 caracteres"}).max(255,{message:"o campo motivoReserva necessita de NO MAXIMO 255 caracteres"}).optional(),
          }));
    }
    async gerarHoraFim(horaInicio, duracao) {
        try {
            if (!horaInicio) {
                throw new Error('Hora de início inválida');
            }
            
            const horaInicioDate = new Date(horaInicio);
            horaInicioDate.setHours(horaInicioDate.getHours() + parseInt(duracao));
            const novaHoraString = `${horaInicioDate.getHours().toString().padStart(2, '0')}:${horaInicioDate.getMinutes().toString().padStart(2, '0')}`;
            return novaHoraString;
        } catch (error) {
            await this.salvarErro(error.name, error.message, 'ListaNegra', 'gerarHoraFim');
            throw error;
        }
    }
    
    
    async reservaStatus(situacao){
        try{
            return await dataSource.Reserva.findAll({where:{statusReserva:situacao}});
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'reservaStatus');
            throw error;
        }
    }

    async verificaHorarioReserva(id_sala, dataReservada) {
        try{
            const reservas = await dataSource.Reserva.findAll({
                where: {
                    idSala: id_sala,
                    dataReservada: dataReservada,
                    statusReserva: ['confirmada', 'pendente']
                }
            });
            return reservas.length > 0;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'verificaHorarioReserva');
            throw error;
        }
    }
    
    async verificaDisponibilidade(id_sala, dataReservada, horaReservada) {
        try{
            const reservaDia = await this.verificaHorarioReserva(id_sala, dataReservada);
            if (!reservaDia) return false;
            const reserva = await dataSource.Reserva.findOne({
                where: {
                    idSala: id_sala,
                    dataReservada: dataReservada,
                    horaInicio: horaReservada,
                    statusReserva: ['confirmada', 'pendente']
                }
            });
            return reserva;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'verificaDisponibilidade');
            throw error;
        }
    }
    
    async criaRegistro(novoRegistro) {
        try{
            const response = await this.verificaDisponibilidade(novoRegistro.idSala, novoRegistro.dataReservada, novoRegistro.horaInicio);
            if (response) return { error: 'Sala já reservada' };
            novoRegistro.statusReserva = 'pendente';
            const novaHoraString = await this.gerarHoraFim(novoRegistro.horaInicio, 3);
            novoRegistro.horaFimReserva = novaHoraString;
            console.log(novaHoraString);
            const createdReserva = await dataSource.Reserva.create(novoRegistro);
            return createdReserva;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'criaRegistro');
            throw error;
        }
    }

    async atualizar(dadosAtualizados, id) {
        try {
            const dadosExistentes = await this.pegaUmRegistro(id);
            if (!dadosExistentes) {
                const errorMessage = 'Registro não encontrado';
                await this.salvarErro('NotFound', errorMessage, 'Reserva', 'atualizar');
                throw new Error(errorMessage);
            }
    
            // Verificações adicionais conforme necessidade do seu sistema
            if (dadosAtualizados.statusReserva === 'CONFIRMADO' || dadosAtualizados.statusReserva === 'CANCELADO') {
                const errorMessage = 'Não é possível confirmar ou cancelar uma reserva inexistente';
                await this.salvarErro('InvalidOperation', errorMessage, 'Reserva', 'atualizar');
                throw new Error(errorMessage);
            }
    
            // Gerar horaFimReserva
            dadosAtualizados.horaFimReserva = await this.gerarHoraFim(dadosExistentes.horaInicio, 3);
    
            // Atualiza o registro no banco de dados
            return await dataSource.Reserva.update(dadosAtualizados, { where: { id } });
        } catch (error) {
            await this.salvarErro(error.name, error.message, 'Reserva', 'atualizar');
            throw error;
        }
    }
    
    
    async buscarReservista(idUsuario){
        try{
            return await dataSource.Reserva.findOne({where:{idUsuario}});
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'buscarReservista');
            throw error;
        }
    }

    async confirmarReserva(id){
        const atualizacao={
            statusReserva:'CONFIRMADO',
            dataModificacaoStatus:new Date()
        };
        try{
            const reserva =  await this.pegaUmRegistro(id);
            if(reserva.statusReserva === 'PENDENTE') return await dataSource.Reserva.update(atualizacao,{where:{id}});
            return {error: 'Reserva já confirmada'};
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'confirmarEntrega');
            throw error;
        }
    }

    async concluirReserva(id, concluirReserva){
        const concluir={
            statusReserva:'CONCLUIDO',
            dataModificacaoStatus:new Date()
        };

        try{
            const reserva=await this.pegaUmRegistro(id);
            if(reserva.statusReserva==='CONFIRMADO'){
                if(concluirReserva.infracao){
                    const idResponsavel = reserva.idUsuario;
                    const motivo = concluirReserva.motivoInfracao;
                    const registroInfracao = { idResponsavel, id, motivo};
                    await listaNegraServices.criaRegistro(registroInfracao);
                }
            }
            return await dataSource.Reserva.update(concluir,{where:{id}});
        }catch{
            await this.salvarErro(error.name, error.message, 'Reserva', 'concluirReserva');
            throw error;
        };
    }
}

module.exports=ReservaServices;