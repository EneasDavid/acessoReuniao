const jwt = require('jsonwebtoken');

require('dotenv').config()
let senha=process.env.SENHA_JWT;

// Função para gerar um token JWT com um determinado nível de acesso
const gerarToken = (nivelAcesso) => {
    return jwt.sign({ nivelAcesso: nivelAcesso }, senha, { expiresIn: '1h' });
};

module.exports = gerarToken;