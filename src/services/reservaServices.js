const Services=require('./services.js');
const listaNegraServices=require('./listaNegraServices.js');
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
            statusReserva:z.string().min(7,'O campo status necessita de no minimo 7 caracteres').max(10,'O campo status necessita de no maximo 10 caracteres'),
            dataModificacaoStatus:z.string().date({message:"O campo dataModificacaoStatus necessita do time yyyy-mm-dd"}),
            motivoReserva:z.string().min(5,{message:"o campo motivoReserva necessita de NO MINIMO 5 caracteres"}).max(255,{message:"o campo motivoReserva necessita de NO MAXIMO 255 caracteres"}).optional().nullish(),
          }));
    }
    
    async gerarHoraFim(horaInicio, duracao) {
        try {
            const horaInicioDate = new Date(horaInicio);
            horaInicioDate.setHours(horaInicioDate.getHours() + parseInt(duracao));
            const novaHoraString = await this.formatarHora(horaInicioDate);
            return novaHoraString;
        } catch (error) {
            await this.salvarErro(error.name, error.message, 'reserva', 'gerarHoraFim');
            throw error;
        }
    }

    async formatarHora(hora) {
        try {
            return `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}:${hora.getSeconds().toString().padStart(2, '0')}`;
        } catch (error) {
            this.salvarErro(error.name, error.message, 'reserva', 'formatarHora');
            throw error;
        }
    }

    async formatarData(data) {
        try {
            return `${data.getFullYear().toString().padStart(4, '0')}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}`;
        } catch (error) {
            this.salvarErro(error.name, error.message, 'reserva', 'formatarData');
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
        try {
            const response = await this.verificaDisponibilidade(novoRegistro.idSala, novoRegistro.dataReservada, novoRegistro.horaInicio);
            if (response) return { error: 'Sala já reservada' };
    
            novoRegistro.statusReserva = 'pendente';

            const [novoHorarioInicio, novaHorarioFim, dataReservadaFormata, dataModificaStatusFormata] = await Promise.all([
                     this.formatarHora(new Date(novoRegistro.horaInicio)),
                     this.gerarHoraFim(novoRegistro.horaInicio, 3),
                     this.formatarData(new Date(novoRegistro.dataReservada)),
                     this.formatarData(new Date(novoRegistro.dataModificacaoStatus)),
            ]);
            novoRegistro.horaInicio = novoHorarioInicio;
            novoRegistro.horaFimReserva = novaHorarioFim;
            novoRegistro.dataReservada = dataReservadaFormata; 
            novoRegistro.dataModificacaoStatus = dataModificaStatusFormata; 
    
            await this.validarDados(novoRegistro);
            
            return await dataSource.Reserva.create(novoRegistro);
        } catch (error) {
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
            const dadosParaAtualizar = {
                ...dadosExistentes.toJSON(),
                ...dadosAtualizados, 
                updatedAt: new Date(), 
            };

            if (dadosParaAtualizar.statusReserva === 'CONFIRMADO' || dadosParaAtualizar.statusReserva === 'CANCELADO') {
                const errorMessage = 'Não é possível confirmar ou cancelar uma reserva inexistente';
                await this.salvarErro('InvalidOperation', errorMessage, 'Reserva', 'atualizar');
                throw new Error(errorMessage);
            }
            if(dadosAtualizados.horaInicio){
                const [novoHorarioInicio, novaHorarioFim] = await Promise.all([
                     this.formatarHora(new Date(dadosParaAtualizar.horaInicio)),
                     this.gerarHoraFim(dadosParaAtualizar.horaInicio, 3),
                ]);                
                dadosParaAtualizar.horaInicio = novoHorarioInicio;
                dadosParaAtualizar.horaFimReserva = novaHorarioFim;
            }

            await this.validarDados(dadosParaAtualizar);
            return await dataSource.Reserva.update(dadosParaAtualizar, { where: { id } });
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
            statusReserva:'confirmado',
            dataModificacaoStatus: await this.formatarData(new Date())
        };
        try{
            const reserva = await this.pegaUmRegistro(id);
            if(reserva.statusReserva === 'pendente') return await dataSource.Reserva.update(atualizacao, { where: { id } }); 
            await this.salvarErro('status incorreto', 'Reserva não está PENDENTE', 'Reserva', 'confirmarEntrega');
            throw new Error({error: 'Reserva já confirmada'});
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'confirmarEntrega');
            throw error;
        }
    }

    async concluirReserva(id, concluirReserva){
        const concluir={
            statusReserva:'concluido',
            dataModificacaoStatus: await this.formatarData(new Date())
        };
        try{
            const reserva=await this.pegaUmRegistro(id);
            if(reserva.statusReserva==='confirmado'){
                if(concluirReserva.infracao){
                    const idResponsavel = reserva.idUsuario;
                    const motivo = concluirReserva.motivoInfracao;
                    const registroInfracao = { idResponsavel, id, motivo};
                    await listaNegraServices.criaRegistro(registroInfracao);
                }
                return await dataSource.Reserva.update(concluir, { where: { id } });
            }
            await this.salvarErro('status incorreto', 'Reserva não está CONFIRMADO', 'Reserva', 'concluirReserva');
            throw new Error({error: 'Reserva já Concluida ou inda pendente'});
        }catch{
            await this.salvarErro(error.name, error.message, 'Reserva', 'concluirReserva');
            throw error;
        };
    }
}

module.exports=ReservaServices;