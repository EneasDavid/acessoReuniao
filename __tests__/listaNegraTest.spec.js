const request = require('supertest');
const app = 'http://localhost:3000';
const gerarToken=require('../src/middleware/criarTolke.js');

describe('Teste das rotas de listaNegra', () => {
    const atributos = ['idResponsavel', 'idReservaMotivo', 'motivo', 'dataBloqueio', 'estadoBloqueio'];
    const validData = {
        id:2, //Importante travar no id 2 para não dar erro
        idResponsavel: 1,
        idReservaMotivo: 1,
        codBloqueio: 'P4UDUR0R0S',
        motivo: 'Motivo de exemplo',
        dataBloqueio: '2021-08-01'
    };

    it('Deve listar todas as listaNegras', async () => {
        const token = gerarToken(1); // Gerar token com nível de acesso 1
        const response = await request(app)
            .get('/listaNegra')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve retornar uma listaNegra por ID', async () => {
        const token = gerarToken(1); // Gerar token com nível de acesso 1
        const response = await request(app)
            .get('/listaNegra/2')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve criar uma nova listaNegra', async () => {
        const token = gerarToken(1); // Gerar token com nível de acesso 1
        const response = await request(app)
            .post('/listaNegra')
            .send(validData)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve atualizar uma listaNegra existente com todos os atributos', async () => {
        const token = gerarToken(1); // Gerar token com nível de acesso 1
        const response = await request(app)
            .put('/listaNegra/2')
            .set('Authorization', `Bearer ${token}`)
            .send({ motivo: 'Novo motivo' });
        expect(response.status).toBe(200);
    });

    atributos.forEach(atributo => {
        it(`Deve retornar erro ao tentar atualizar com o atributo ${atributo} nulo`, async () => {
            const token = gerarToken(1); // Gerar token com nível de acesso 1
            const updatedData = { ...validData, [atributo]: null };
            const response = await request(app)
                .put('/listaNegra/2')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
            expect(response.status).toBe(500);
        });
    });

    it('Deve deletar uma listaNegra existente', async () => {
        const token = gerarToken(1); // Gerar token com nível de acesso 1
        const response = await request(app)
            .delete('/listaNegra/2')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
