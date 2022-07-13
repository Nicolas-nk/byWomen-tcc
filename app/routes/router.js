var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/home/index')
});

router.get('/pedidos', function(req, res) {
    res.render('pages/pedidosServiços/index')
});

router.get('/login', function(req, res) {
    res.render('pages/login/index')
});

router.get('/esqueci-senha', function(req, res) {
    res.render('pages/esqueciSenha/index')
});

router.get('/recuperar-senha', function(req, res) {
    res.render('pages/esqueciSenha/index')
});

router.get('/menu', function(req, res) {
    res.render('components/menuHamburger/index')
});

router.get('/perfil', function(req, res){
    res.render('pages/perfilCliente/index')
});

module.exports = router;