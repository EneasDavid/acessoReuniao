const {Router}= require('express');
const UsuarioController=require('../controller/usuarioController.js');
const usuarioController=new UsuarioController();
const router=Router();
const verificarToken = require('../middleware/authReservista.js');

router.get('/usuario', verificarToken(2), (req, res) => usuarioController.pegaTodos(req, res));
router.get('/usuario/:id', verificarToken(2), (req, res) => usuarioController.pegaPorId(req,res));
router.post('/usuario', verificarToken(2), (req, res) => usuarioController.cria(req, res));
router.put('/usuario/:id', verificarToken(2), (req, res) => usuarioController.atualiza(req, res));
router.get('/usuario/consulta/:identificador/:dataNascimento', verificarToken(2), (req, res) => usuarioController.consultarUsuario(req, res));
router.delete('/usuario/:id', verificarToken(1), (req, res) => usuarioController.deleta(req,res));

module.exports=router;