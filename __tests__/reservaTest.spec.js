const request = require('supertest');
const app = 'http://localhost:3000';
const gerarToken=require('../src/middleware/criarTolke.js');

describe('Teste das rotas de reserva', ()=>{
    const atributos = ['idSala', 'idUsuario', 'idRecepcionista', 'dataReservada', 'horaInicio', 'statusReserva'];
    const validData = {
        //id:5,
        idSala:2,
        idUsuario:1,
        idRecepcionista:1,
        dataReservada: new Date(),
        horaInicio: new Date(),
        statusReserva:'PENDENTE',
        dataModificacaoStatus: new Date(),
    };

    it('Deve listar todas as reservas', async()=>{
        const response = await request(app)
            .get('/reserva')
        expect(response.status).toBe(200);
    });
    it('Deve criar uma nova reserva', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .post('/reserva')
            .send(validData)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve retornar uma reserva por ID', async()=>{
        const response = await request(app)
            .get('/reserva/5');
        expect(response.status).toBe(200);
    });

    it('Deve retornar se uma sala está disponivel em um certo horario', async ()=>{
        const response = await request(app)
            .get('/reserva/1/2024-04-24');
        expect(response.status).toBe(200);
    });
    
    it('Deve retornar se uma sala tem alguma reserva em certa data', async()=>{
        const response=await request(app)
            .get('/reserva/1/2024-04-24/19:37:11');
        expect(response.status).toBe(200);
    });
    
    it('Deve retornar todas as reservas de uma sala', async()=>{
        const response = await
        request(app)
            .get('/reserva/status/concluida')
        expect(response.status).toBe(200);
    });
    
    it('Deve atualizar uma reserva existente', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .put('/reserva/5')
            .send({idRecepcionista: 2})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    atributos.forEach(atributo => {
        it(`Deve retornar erro ao tentar atualizar com o atributo ${atributo} nulo`, async () => {
            const token = gerarToken(1); 
            const updatedData = { ...validData, [atributo]: null };
            const response = await request(app)
                .put('/reserva/5')
                .send(updatedData)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(500); // Ajuste conforme necessário
        });
    });
    

    it('Deve confirmar uma reserva pendente', async () => {
        const token = gerarToken(1); 
        const response = await request(app)
            .put('/reserva/confirmar/5')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200); 
    });
    
    it('Deve concluir uma reserva confirmada', async () => {
        const token = gerarToken(1); 
        const response = await request(app)
            .put('/reserva/concluir/5')
            .send({ infracao: false})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    

    it('Deve deletar uma reserva existente', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .delete('/reserva/5')
            .set('Authorization', `Bearer ${token}`); 
        expect(response.status).toBe(200); 
    });
});