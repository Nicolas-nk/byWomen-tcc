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

router.get('/Menu', function(req, res) {
    res.render('components/menuHamburguer/index')
})

module.exports = router;