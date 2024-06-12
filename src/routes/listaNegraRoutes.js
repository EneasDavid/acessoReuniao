const {Router}= require('express');
const ListaNegraController=require('../controller/listaNegraController.js');
const listaNegraController=new ListaNegraController();
const router=Router();
const verificarToken = require('../middleware/authReservista.js');

router.get('/listaNegra', verificarToken(2), (req, res) => listaNegraController.pegaTodos(req, res));
router.get('/listaNegra/:id', verificarToken(2), (req, res) => listaNegraController.pegaPorId(req,res));
router.post('/listaNegra', verificarToken(2), (req, res) => listaNegraController.cria(req, res));
router.put('/listaNegra/:id', verificarToken(2), (req, res) => listaNegraController.atualiza(req, res));
router.delete('/listaNegra/:id', verificarToken(1), (req, res) => listaNegraController.deleta(req,res));

module.exports=router;