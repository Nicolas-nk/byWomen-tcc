var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/home/index')
})

router.get('/Pedidos', function(req, res) {
    res.render('pages/pedidosServiços/pedidosServiços')
})

router.get('/Login', function(req, res) {
    res.render('pages/login/login')
})

module.exports = router;