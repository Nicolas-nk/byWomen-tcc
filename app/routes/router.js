const { json } = require("express");
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };

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
    res.render("pages/perfilCliente/index", req.session);
  } else {
    res.redirect("/login");
  }
});

router.get("/configuracao", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/configuracao/index", req.session);
  } else {
    res.redirect("/login");
  }
});

router.get("/pedidos", function (req, res) {
  res.render("pages/pedidosServiços/index", req.session);
});

router.get("/menu", function (req, res) {
  res.render("pages/menuHamburger-logoff/index", req.session);
});

router.get("/perfil-colaboradora", function (req, res) {
  res.render("pages/perfilColaboradora/index", req.session);
});
router.get("/perfilColaboradora", function (req, res) {
  res.render("pages/perfilColaboradora-visãoCliente/index", req.session);
});

router.get("/planos", function (req, res) {
  res.render("pages/planos/index", req.session);
});

router.get("/servicos", function (req, res) {
  res.render("pages/serviços/index", req.session);
});

router.get("/menu-logon", function (req, res) {
  res.render("pages/menuHamburger-logado/index", req.session);
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
router.get("/crieperfil", function (req, res) {
  res.render("pages/formColaboradora/criePerfil/index");
});
router.get("/selecioneProf", function (req, res) {
  res.render("pages/formColaboradora/selecioneProf/index", req.session);
});
router.get("/servicosSolicitados", function (req, res) {
  res.render("pages/servicosSolicitados/index", req.session);
});
router.get("/colaboradorasFavoritas", function (req, res) {
  res.render("pages/colaboradorasFavoritas/index", req.session);
});
router.get("/editarperfil", function (req, res) {
  res.render("pages/editarperfil/index", req.session);
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
