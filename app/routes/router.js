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

router.get('/menu', function(req, res) {
    res.render('pages/menuHamburger-logoff/index')
});

router.get('/perfil', function(req, res){
    res.render('pages/perfilCliente/index')
});

router.get('/perfil-colaboradora', function(req, res){
    res.render('pages/perfilColaboradora/index')
});

router.get('/configuracao', function(req, res){
    res.render('pages/configuracao/index')
});

router.get('/planos', function(req, res){
    res.render('pages/planos/index')
});

router.get('/servicos', function(req, res){
    res.render('pages/serviços/index')
});

router.get('/menu-logon', function(req, res){
    res.render('pages/menuHamburger-logado/index')
});

router.get('/recuperar-senha', function(req, res){
    res.render('pages/recuperar/index')
});

router.get('/recuperar-senha-passo2', function(req, res){
    res.render('pages/recuperar-passo2/index')
});

router.get('/cadastro', function(req, res){
    res.render('pages/cadastre-se/index')
});

router.get('/cadastro-passo2', function(req, res){
    res.render('pages/cadastre-se2/index')
});

router.get('/construcao', function(req, res){
    res.render('pages/construção/index')
});

router.get('/reparo', function(req, res){
    res.render('pages/reparos/index')
});

router.get('/projetos', function(req, res){
    res.render('pages/projetos/index')
});

router.get('/montagem', function(req, res){
    res.render('pages/montagem/index')
});

router.get('/manutencao', function(req, res){
    res.render('pages/manutencao-eletrica/index')
});

module.exports = router;