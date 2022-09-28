const { json } = require("express");
var express = require("express");
var dbConnection = require("../../config/database");
var router = express.Router();

router.get("/", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  colaboradora_autenticado =
    req.session.colaboradora_autenticado === true
      ? { colaboradora_autenticado: req.session.usu_colaboradora_autenticado_id }
      : { colaboradora_autenticado: null };

      console.log(req.session.colaboradora_autenticado)

  res.render("pages/home/index", req.session);
});

router.get("/login", function (req, res) {
  if (req.session.autenticado !== true) {
    res.render("pages/login/index");
  } else {
    res.redirect("/");
  }
});
router.get("/sair", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get("/perfil", function (req, res) {
  if (req.session.autenticado === true) {
    if(req.session.colaboradora_autenticado === true){
      res.render("pages/perfilColaboradora/index", req.session);
    }else{
      res.render("pages/perfilCliente/index", req.session);
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/crie-perfil-profissional", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/criePerfil/index", req.session);
  } else {
    res.redirect("/login");
  } 
});

router.get("/editarperfil", function (req, res) {
  if (req.session.autenticado === true) {
    if(req.session.usu_colaboradora_autenticado_id !== undefined){
      res.render("pages/formColaboradora/criePerfil/index", req.session);
    }else{
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
  res.render("pages/formColaboradora/criePerfil/index", req.session);
});

router.get("/configuracao", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/configuracao/index", req.session);
  } else {
    res.redirect("/login");
  }
});

router.get("/perfilColaboradora", function (req, res) {
  res.render("pages/perfilColaboradora-visãoCliente/index", req.session);
});
router.get("/historico", function (req, res) {
  res.render("pages/historico/index", req.session);
});
router.get("/pedidos", function (req, res) {
  res.render("pages/pedidos/index", req.session);
});

router.get("/planos", function (req, res) {
  res.render("pages/planos/index", req.session);
});

router.get("/servicos", function (req, res) {
  res.render("pages/servicos/index", req.session);
});

router.get("/recuperar-senha", function (req, res) {
  res.render("pages/recuperar/index", req.session);
});

router.get("/recuperar-senha-passo2", function (req, res) {
  res.render("pages/recuperar-passo2/index", req.session);
});

router.get("/cadastre-se", function (req, res) {
  res.render("pages/cadastre-se/index", req.session);
});

router.get("/Construcao", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  res.render("pages/subcategorias-servicos/construção/index", req.session);
});

router.get("/Reparos", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  res.render("pages/subcategorias-servicos/reparos/index", req.session);
});

router.get("/Projetos", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  res.render("pages/subcategorias-servicos/projetos/index", req.session);
});

router.get("/Montagens", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  res.render("pages/subcategorias-servicos/montagem/index", req.session);
});

router.get("/Manutencao-eletrica", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  res.render(
    "pages/subcategorias-servicos/manutencao-eletrica/index",
    req.session
  );
});

router.get("/fotoperfil", function (req, res) {
  res.render("pages/formColaboradora/fotoperfil/index", req.session);
});
router.get("/fotoservico", function (req, res) {
  res.render("pages/formColaboradora/addservico/index", req.session);
});
router.get("/capacitacao", function (req, res) {
  res.render("pages/formColaboradora/capacitacao/index", req.session);
});
router.get("/selecioneProf", function (req, res) {
  res.render("pages/formColaboradora/selecioneProf/index", req.session);
});
router.get("/colaboradorasFavoritas", function (req, res) {
  res.render("pages/colaboradorasFavoritas/index", req.session);
});
router.get("/todasCategorias", function (req, res) {
  res.render("pages/todasCategorias/index", req.session);
});
router.get("/todosServicos", function (req, res) {
  res.render("pages/todosServiços/index", req.session);
});

router.get("/perfilColaboradora", function (req, res) {
  res.render("pages/perfilColaboradora-visãoCliente/index", req.session);
});

router.get("/favoritos", function (req, res) {
  res.render("pages/favoritos/index", req.session);
});

router.get("/cartao", function (req, res) {
  res.render("pages/cartao/index");
});

router.get("/pagamento", function (req, res) {
  res.render("pages/sucesso/index");
});

router.get("/formapagamento", function (req, res) {
  res.render("pages/pagamento/index");
});

module.exports = router;
