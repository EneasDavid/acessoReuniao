const {Router}= require('express');
const EstadoSalaController=require('../controller/estadoSalaController.js');
const estadoSalaController=new EstadoSalaController();
const router=Router();
const verificarToken = require('../middleware/authReservista.js');

router.get('/estadoSala', verificarToken(2), (req, res) => estadoSalaController.pegaTodos(req, res));
router.get('/estadoSala/:id', verificarToken(2), (req, res) => estadoSalaController.pegaPorId(req,res));
router.post('/estadoSala', verificarToken(2), (req, res) => estadoSalaController.cria(req, res));
router.put('/estadoSala/:id', verificarToken(2), (req, res) => estadoSalaController.atualiza(req, res));
router.delete('/estadoSala/:id', verificarToken(2), (req, res) => estadoSalaController.deleta(req,res));

module.exports=router;