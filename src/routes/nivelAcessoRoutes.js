const {Router}= require('express');
const NivelAcessoController=require('../controller/nivelAcessoController.js');
const nivelAcessoController=new NivelAcessoController();
const router=Router();
const verificarToken = require('../middleware/authReservista.js');

router.get('/nivelAcesso', verificarToken(2), (req, res) => nivelAcessoController.pegaTodos(req, res));
router.get('/nivelAcesso/:id', verificarToken(2), (req, res) => nivelAcessoController.pegaPorId(req,res));
router.post('/nivelAcesso', verificarToken(1), (req, res) => nivelAcessoController.cria(req, res));
router.put('/nivelAcesso/:id', verificarToken(1), (req, res) => nivelAcessoController.atualiza(req, res));
router.delete('/nivelAcesso/:id', verificarToken(1), (req, res) => nivelAcessoController.deleta(req,res));

module.exports=router;