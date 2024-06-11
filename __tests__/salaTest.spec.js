const request=require('supertest');
const app='http://localhost:3000';
const jwt = require('jsonwebtoken');

describe('Teste das rotas de sala', ()=>{
    const atributos = ['nome', 'andar', 'area', 'capMax', 'situacao'];
    const sala={
        id:5,
        nome: "Sala 4",
        andar: 0,
        area: "Coworking",
        capMax: 5,
        situacao: "A",
    }
    // Função para gerar um token JWT com um determinado nível de acesso
    const gerarToken = (nivelAcesso) => {
        return jwt.sign({ nivelAcesso: nivelAcesso }, 'Enéas é foda', { expiresIn: '1h' });
    };
    it('Deve listar todas as salas', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .get('/sala')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve criar uma nova sala', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .post('/sala')
            .send(sala)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200); 
    });

    it('Deve retornar uma sala por ID', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .get('/sala/5')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it('Deve atualizar uma sala existente', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .put('/sala/5')
            .send({area: 'coworking'})
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    
    atributos.forEach((atributo) => {
        it(`Deve retornar erro 500 ao tentar atualizar uma sala sem o atributo '${atributo}'`, async()=>{
            const token = gerarToken(1); 
            const novaSala = { ...sala, [atributo]: null};
            const response = await request(app)
                .put('/sala/5')
                .send(novaSala)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(500);
        });
    });
    
    it('Deve deletar uma sala existente', async()=>{
        const token = gerarToken(1); 
        const response = await request(app)
            .delete('/sala/5')
            .set('Authorization', `Bearer ${token}`); 
        expect(response.status).toBe(200); 
    });

});