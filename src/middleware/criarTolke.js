const jwt = require('jsonwebtoken');

// Função para gerar um token JWT com um determinado nível de acesso
const gerarToken = (nivelAcesso) => {
    return jwt.sign({ nivelAcesso: nivelAcesso }, 'SectiAlagoas@2024%', { expiresIn: '10s' });
};

module.exports = gerarToken;