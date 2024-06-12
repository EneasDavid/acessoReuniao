const request = require('supertest');
const app = 'http://localhost:3000';
const gerarToken=require('../src/middleware/criarTolke.js');

describe('Teste das rotas de usuario', () => {
    const atributos = ['identificador', 'nome', 'sobrenome', 'email', 'numTelefone', 'dataNascimento'];
    const validData = {
        id: 4, // Importante travar no id 2 para não dar erro
        identificador: '00000000000',
        nome: 'Enéas',
        sobrenome: 'Ferreira',
        email: 'eneas.ferreira@example.com',
        numTelefone: '81999999999',
        dataNascimento: '2003-12-03',
    };

    it('Deve listar todos os usuarios', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .get('/usuario')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve retornar um usuario por ID', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .get('/usuario/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve criar um novo usuario', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .post('/usuario')
            .send(validData)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve atualizar um usuario existente com todos os atributos', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .put('/usuario/4')
            .send({nome: 'David', sobrenome: 'Enéas'})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    atributos.forEach(atributo => {
        it(`Deve retornar erro ao tentar atualizar com o atributo ${atributo} nulo`, async()=>{
            const token = gerarToken(1); 
            const updatedData = { ...validData, [atributo]: null };
            const response = await request(app)
                .put('/usuario/4')
                .send(updatedData)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(500);
        });
    });

    it('Deve deletar um usuario existente', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .delete('/usuario/4')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
