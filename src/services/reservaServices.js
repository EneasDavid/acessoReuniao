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

            //Por isso separado 
            const [hours, minutes] = novoRegistro.horaInicio.split(":").map(Number);
            const novaHora = (hours + 3) % 24; // Adiciona 3 horas e garante que a hora permaneça dentro do intervalo de 0 a 23
            const novaHoraString = `${novaHora.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            novoRegistro.horaFimReserva = novaHoraString;
            //This.criar tava chamadno recursivamente o criaRegistro    
            const createdReserva = await dataSource.Reserva.create(novoRegistro);
            return createdReserva;
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'criaRegistro');
            throw error;
        }
    }
    
    async buscarReservista(id_reservista){
        try{
            return await dataSource.Reserva.findOne({where:{idUsuario:id_reservista}});
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'buscarReservista');
            throw error;
        }
    }

    async confirmarReserva(id_reserva){
        const atualizacao={
            statusReserva:'CONFIRMADO',
            dataModificacaoStatus:new Date()
        };
        try{
            const reserva =  await this.pegaUmRegistro(id_reserva);
            if(reserva.statusReserva === 'PENDENTE') return await this.atualiza(atualizacao);
            return {error: 'Reserva já confirmada'};
        }catch(error){
            await this.salvarErro(error.name, error.message, 'Reserva', 'confirmarEntrega');
            throw error;
        }
    }

    async concluirReserva(id_resreva, infracao=false, motivoInfracao = ''){
        const concluir={
            statusReserva:'CONCLUIDO',
            dataModificacaoStatus:new Date()
        };
        try{
            const reserva=await this.pegaUmRegistro(id_resreva);
            if(reserva.statusReserva==='CONFIRMADO'){
                if(infracao){
                    const idResponsavel = reserva.idUsuario;
                    const motivo = motivoInfracao;
                    const registroInfracao = { idResponsavel, id_resreva, motivo};
                    await listaNegraServices.criaRegistro(registroInfracao);
                }
            } return await this.atualiza(concluir);
        }catch{
            await this.salvarErro(error.name, error.message, 'Reserva', 'concluirReserva');
            throw error;
        };
    }
}

module.exports=ReservaServices;