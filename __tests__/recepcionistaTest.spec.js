const request=require('supertest');
const app='http://localhost:3000';
describe('Teste dos metodos atrelados a recepcionista', ()=>{
    const atributos = ['login', 'senha', 'identificador', 'ativo', 'tipo', 'nivelAcesso'];
    const recepcionista={
        id:3,
        login: "Enéas é foda",
        senha: "eneasEfoda",
        nome: "Enéas",
        sobrenome: "Ferreira",
        ativo: true,
        nivelAcesso: 2
    };
    const insercaoPadrao=[
        {
            login: "garota de ipanema",
            senha: "quase me chamou de amor",
            nome:"Bruna",
            sobrenome:"Castro",
            ativo: true,
            nivelAcesso: 1,
        },{
            login: "chefion",
            senha: "culpado de amor",
            nome:"Ulpio",
            sobrenome:"Neto",
            ativo: true,
            nivelAcesso: 2,
        }
    ];
    insercaoPadrao.forEach(recepcionista => {
        it('Deve criar os usuarioas padrão do sistema', async()=>{
            const response=await request(app)           
                .post('/recepcionista')
                .send(recepcionista);
            expect(response.status).toBe(200);
        });
    });
    it('Deve listar todos os recepcionistas', async () => {
        const response = await request(app).get('/recepcionista');
        expect(response.status).toBe(200);
    });

    it('Deve retornar um recepcionista por ID', async () => {
        const response = await request(app).get('/recepcionista/3');
        expect(response.status).toBe(200);
    });


    it('Deve criar um novo recepcionista', async () => {
        const response = await request(app)
            .post('/recepcionista')
            .send(recepcionista);
        expect(response.status).toBe(200); 
    });

    it.only('Deve realizar login de recepcionista', async () => {
        const response = await request(app)
            .post('/recepcionista/login')
            .send({ login: 'Enéas é foda', senha: 'eneasEfoda' });
            expect(response.status).toBe(200);
    });

    it('Deve retornar erro ao tentar criar um novo recepcionista com identificador inválido', async () => {
        const invalidUser = { ...recepcionista, id:3, identificador: "111222333" };
        const response = await request(app)
            .post('/recepcionista')
            .send(invalidUser);
        expect(response.status).toBe(500);
    });

    it('Deve retornar erro por não passar em validação de formatação de Senha', async () => {
        const response = await request(app)
            .put('/recepcionista/3')
            .send({senha: 'eneas'});
        expect(response.status).toBe(500);
    });

    it('Deve atualizar um recepcionista existente', async () => {
        const response = await request(app)
            .put('/recepcionista/3')
            .send({login: "Enéas é um deus"});
            expect(response.status).toBe(200);
    });
    
    it('Deve retornar erro por não passar em validação de formatação de Identificador', async () => {
        const response = await request(app)
            .put('/recepcionista/2')
            .send({identificador: '111222333'});
        expect(response.status).toBe(500);
    });
    

    atributos.forEach(atributo => {
        it(`Deve retornar erro 500 ao tentar criar um recepcionista sem o atributo '${atributo}'`, async () => {
            const novoUser = { ...recepcionista, [atributo]:null};
            const response = await request(app)
                .put('/recepcionista/2')
                .send(novoUser);
            expect(response.status).toBe(500);
        });
    });
    
    it('Deve deletar um recepcionista existente', async () => {
        const response = await request(app).delete('/recepcionista/3'); 
        expect(response.status).toBe(200); 
    });
});