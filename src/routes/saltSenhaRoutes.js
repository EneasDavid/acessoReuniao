const {Router}= require('express');
const SaltSenhaController=require('../controller/saltSenhaController.js');
const saltSenhaController=new SaltSenhaController();
const router=Router();

router.get('/saltSenha', (req, res) => saltSenhaController.pegaTodos(req, res));
router.get('/saltSenha/:id', (req, res) => saltSenhaController.pegaPorId(req,res));
router.post('/saltSenha', (req, res) => saltSenhaController.cria(req, res));
router.put('/saltSenha/:id', (req, res) => saltSenhaController.atualiza(req, res));
router.delete('/saltSenha/:id', (req, res) => saltSenhaController.deleta(req,res));

module.exports=router;