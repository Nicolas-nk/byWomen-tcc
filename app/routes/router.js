var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/home/index')
})

router.get('/Pedidos', function(req, res) {
    res.render('pages/pedidosServiços/index')
})

router.get('/Login', function(req, res) {
    res.render('pages/login/index')
})

router.get('/Esqueci-Senha', function(req, res) {
    res.render('pages/esqueciSenha/index')
})

router.get('/Recuperar-Senha', function(req, res) {
    res.render('pages/esqueciSenha/index')
})

router.get('/Menu', function(req, res) {
    res.render('components/menuHamburger/index')
})

router.get('/PerfilCliente', function(req, res){
    res.render('pages/perfilCliente/index')
})

module.exports = router;