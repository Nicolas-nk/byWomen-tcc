var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if (req.session.autenticado) {
        autenticado = { autenticado: req.session.usu_autenticado };
        console.log("autenticado")
      } else {
        autenticado = { autenticado: null };
        console.log("não autenticado")
      }
    res.render('pages/home/index');
});

router.get("/sair", function (req, res) {
    req.session.destroy();
    res.redirect("/");
  });

router.get('/pedidos', function(req, res) {
    res.render('pages/pedidosServiços/index');
});

router.get('/login', function(req, res) {
    res.render('pages/login/index');
});

router.get('/menu', function(req, res) {
    res.render('pages/menuHamburger-logoff/index');
});

router.get('/perfil', function(req, res){
    res.render('pages/perfilCliente/index');
});

router.get('/perfil-colaboradora', function(req, res){
    res.render('pages/perfilColaboradora/index');
});

router.get('/configuracao', function(req, res){
    res.render('pages/configuracao/index');
});

router.get('/planos', function(req, res){
    res.render('pages/planos/index');
});

router.get('/servicos', function(req, res){
    res.render('pages/serviços/index');
});

router.get('/menu-logon', function(req, res){
    res.render('pages/menuHamburger-logado/index');
});

router.get('/recuperar-senha', function(req, res){
    res.render('pages/recuperar/index');
});

router.get('/recuperar-senha-passo2', function(req, res){
    res.render('pages/recuperar-passo2/index');
});

router.get('/cadastre-se', function(req, res){
    res.render('pages/cadastre-se/index');
});

router.get('/construcao', function(req, res){
    res.render('pages/subcategorias-servicos/construção/index');
});

router.get('/reparo', function(req, res){
    res.render('pages/subcategorias-servicos/reparos/index');
});

router.get('/projeto', function(req, res){
    res.render('pages/subcategorias-servicos/projetos/index');
});

router.get('/montagem', function(req, res){
    res.render('pages/subcategorias-servicos/montagem/index');
});

router.get('/manutencao-eletrica', function(req, res){
    res.render('pages/subcategorias-servicos/manutencao-eletrica/index');
});

router.get('/certificacao', function(req, res){
    res.render('pages/certificacao/index');
});

router.get('/fotoperfil', function(req, res){
    res.render('pages/fotoperfil/index')
});
router.get('/capacitacao', function(req, res){
    res.render('pages/capacitacao/index')
});
router.get('/servicosSolicitados', function(req, res){
    res.render('pages/servicosSolicitados/index')
});
router.get('/colaboradorasFavoritas', function(req, res){
    res.render('pages/colaboradorasFavoritas/index')
});
router.get('/selecioneProf', function(req, res){
    res.render('pages/selecioneProf/index')
});
router.get('/editarperfil', function(req, res){
    res.render('pages/editarperfil/index')
});
router.get('/todasCategorias', function(req, res){
    res.render('pages/todasCategorias/index')
});
router.get('/todosServicos', function(req, res){
    res.render('pages/todosServiços/index')
});

router.get('/perfilColaboradora', function(req, res){
    res.render('pages/perfilColaboradora-visãoCliente/index')
});

router.get('/favoritos', function(req, res){
    res.render('pages/favoritos/index')
}); 

module.exports = router;