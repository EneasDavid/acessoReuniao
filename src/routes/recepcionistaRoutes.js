const {Router}= require('express');
const RecepcionistaController=require('../controller/recepcionistaController.js');
const recepcionistaController=new RecepcionistaController();
const router=Router();
const verificarToken = require('../middleware/authReservista.js');

//CRUD
router.get('/recepcionista', verificarToken(1), (req, res) => recepcionistaController.pegaTodos(req, res));
router.get('/recepcionista/:id', verificarToken(1), (req, res) => recepcionistaController.pegaPorId(req,res));
router.post('/recepcionista', verificarToken(1), (req, res) => recepcionistaController.cria(req, res));
router.put('/recepcionista/:id', verificarToken(1), (req, res) => recepcionistaController.atualiza(req, res));
router.delete('/recepcionista/:id', verificarToken(1), (req, res) => recepcionistaController.deleta(req,res));


//Login
router.post('/recepcionista/login', (req, res) => recepcionistaController.login(req, res));
module.exports=router;