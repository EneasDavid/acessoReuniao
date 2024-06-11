const {Router}= require('express');
const SalaController=require('../controller/salaController.js');
const salaController=new SalaController();
const router=Router();
const verificarToken=require('../middleware/authReservista.js');
router.get('/sala', (req, res) => salaController.pegaTodos(req, res));
router.get('/sala/:id', (req, res) => salaController.pegaPorId(req,res));
router.post('/sala', verificarToken(1), (req, res) => salaController.cria(req, res));
router.put('/sala/:id', verificarToken(1), (req, res) => salaController.atualiza(req, res));
router.delete('/sala/:id', verificarToken(1), (req, res) => salaController.deleta(req,res));

module.exports=router;
