const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet'); // Pacote para adicionar headers de segurança
const rateLimit = require('express-rate-limit'); // Pacote para limitar a taxa de solicitações

const app = express();

// Middleware de segurança
app.use(cors()); // Middleware CORS para permitir solicitações de várias origens
app.use(helmet()); // Middleware Helmet para adicionar headers de segurança

// Limitador de taxa para proteção contra ataques de força bruta
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

// Middleware para registrar todas as solicitações
app.use((req, res, next) => {
  console.log(`Nova solicitação: ${req.method} ${req.originalUrl}`);
  next();
});

// Rota inicial
app.get('/', (req, res) => {
  res.status(200).send({ mensagem: 'Enéas é foda!' });
});

// Rotas da aplicação
routes(app);

module.exports = app;