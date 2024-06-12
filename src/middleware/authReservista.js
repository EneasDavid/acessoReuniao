// Verifica o acesso com o token JWT
const jwt = require('jsonwebtoken');
const palavraPasse = 'SectiAlagoas@2024%';

const verificarAcesso = (nivelAcessoRequerido) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' });
    jwt.verify(token.split(' ')[1], palavraPasse, (err, decoded) => {
      if (err) return res.status(401).json({ mensagem: 'Token inválido' });
      if (decoded.nivelAcesso > nivelAcessoRequerido) return res.status(403).json({ mensagem: 'Acesso proibido' });
      req.usuarioId = decoded.id;
      next();
    });
  };
};

module.exports = verificarAcesso;
