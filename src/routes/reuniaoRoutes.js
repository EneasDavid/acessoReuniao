const {Router}= require('express');
const ReuniaoController=require('../controller/reuniaoController.js');
const reuniaoController=new ReuniaoController();
const router=Router();
const verificarToken = require('../middleware/authReservista.js');

router.get('/reuniao', (req, res) => reuniaoController.pegaTodos(req, res));
router.get('/reuniao/:id', (req, res) => reuniaoController.pegaPorId(req,res));
router.post('/reuniao', verificarToken(2), (req, res) => reuniaoController.cria(req, res));
router.put('/reuniao/:id', verificarToken(2), (req, res) => reuniaoController.atualiza(req, res));
router.delete('/reuniao/:id', verificarToken(1), (req, res) => reuniaoController.deleta(req,res));

module.exports=router;