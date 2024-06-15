const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet'); // Pacote para adicionar headers de segurança

const app = express();

// Middleware de segurança
app.use(cors()); // Middleware CORS para permitir solicitações de várias origens
app.use(helmet()); // Middleware Helmet para adicionar headers de segurança

// Middleware para printar as requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota inicial
app.get('/', (req, res) => {
  res.status(200).send({ mensagem: 'Enéas é foda!' });
});

// Rotas da aplicação
routes(app);

module.exports = app;