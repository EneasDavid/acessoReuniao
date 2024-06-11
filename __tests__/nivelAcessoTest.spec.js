const request = require('supertest');
const app = 'http://localhost:3000';
const jwt = require('jsonwebtoken');

describe('Teste das rotas de nivelAcesso', () => {
    const atributos = ['nivelAcesso', 'glossarioNivel'];
    const validData = {
        id:3, //Importante travar no id 5 para não dar erro
        nivelAcesso: 3,
        glossarioNivel: 'Nível de acesso Enéas (o acesso dos deuses)',
    };
    // Função para gerar um token JWT com um determinado nível de acesso
    const gerarToken = (nivelAcesso) => {
        return jwt.sign({ nivelAcesso: nivelAcesso }, 'Enéas é foda', { expiresIn: '60s' });
    };

    it('Deve listar todas as nivelAcessos', async () => {
        const token = gerarToken(1); 
        const response = await request(app)
            .get('/nivelAcesso')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve criar uma nova nivelAcesso', async () => {
        const token = gerarToken(1); 
        const response = await request(app)
            .post('/nivelAcesso')
            .send(validData)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve retornar uma nivelAcesso por ID', async () => {
        const token = gerarToken(1); 
        const response = await request(app)
            .get('/nivelAcesso/3')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve atualizar uma nivelAcesso existente com todos os atributos', async()=> {
        const token = gerarToken(1); 
        const response = await request(app)
            .put('/nivelAcesso/3')
            .send({nivelAcesso: 4,glossarioNivel: 'Novo Nível de Acesso',})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve retornar erro ao tentar atualizar um nivelAcesso com uma informação já existente', async()=>{
        const token = gerarToken(1);
        const response=await request(app)
            .put('/nivelAcesso/3')
            .send({nivelAcesso: 1},`Bearer ${token}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(500);
    });

    atributos.forEach(atributo => {
        it(`Deve retornar erro ao tentar atualizar com o atributo ${atributo} nulo`, async()=>{
            const token = gerarToken(1); 
            const updatedData = { ...validData, [atributo]: null };
            const response = await request(app)
                .put('/nivelAcesso/3')
                .send(updatedData,`Bearer ${token}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(500); 
        });
    });

    it('Deve deletar uma nivelAcesso existente', async () => {
        const token = gerarToken(1); 
        const response = await request(app)
            .delete('/nivelAcesso/3')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
