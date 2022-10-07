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
      ? {
          colaboradora_autenticado: req.session.usu_colaboradora_autenticado_id,
        }
      : { colaboradora_autenticado: null };

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
router.get("/excluir-perfil", function (req, res) {
  if (req.session.autenticado === true) {
    if (req.session.colaboradora_autenticado === true) {
      dbConnection.query(
        " DELETE FROM usuario_colaboradora WHERE id_colaboradora = ?",
        [req.session.usu_colaboradora_autenticado_id],
        function (error, results) {
          if (error) throw error;
          req.session.colaboradora_autenticado = false;
          res.redirect("/perfil");
        }
      );
    } else {
      dbConnection.query(
        " DELETE FROM usuario WHERE id_usuario = ?",
        [req.session.usu_autenticado_id],
        function (error, results) {
          if (error) throw error;
          req.session.destroy();
          res.redirect("/");
        }
      );
    }
  } else {
    res.redirect("/");
  }
});

router.get("/perfil", function (req, res) {
  dbConnection.query(
    "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
    [req.session.usu_colaboradora_autenticado_id],
    (error, results) => {
      if (error) {
        return reject(error);
      }
      req.trabalhos_realizados = results;

      setTimeout(function () {
        dbConnection.query(
          "SELECT * FROM certificacao WHERE id_colaboradora = ?",
          [req.session.usu_colaboradora_autenticado_id],
          (error, results) => {
            if (error) {
              return reject(error);
            }
            req.certificacoes = results;

            if (req.session.autenticado === true) {
              if (req.session.colaboradora_autenticado === true) {
                res.render("pages/perfilColaboradora/index", {
                  session: req.session,
                  trabalhos_realizados: req.trabalhos_realizados,
                  certificacoes: req.certificacoes,
                });
              } else {
                res.render("pages/perfilCliente/index", req.session);
              }
            } else {
              res.redirect("/login");
            }
          }
        );
      }, 200);
    }
  );
});

router.get("/crie-perfil-profissional", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/criePerfil/index", {
      session: req.session,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/editarperfil", function (req, res) {
  dbConnection.query(
    "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
    [req.session.usu_colaboradora_autenticado_id],
    (error, results) => {
      if (error) {
        return reject(error);
      }
      req.trabalhos_realizados = results;

      setTimeout(function () {
        dbConnection.query(
          "SELECT * FROM certificacao WHERE id_colaboradora = ?",
          [req.session.usu_colaboradora_autenticado_id],
          (error, results) => {
            if (error) {
              return reject(error);
            }
            req.certificacoes = results;

            if (req.session.colaboradora_autenticado === true) {
              res.render("pages/formColaboradora/criePerfil/index", {
                session: req.session,
                trabalhos_realizados: req.trabalhos_realizados,
                certificacoes: req.certificacoes,
              });
            } else if (req.session.autenticado === true) {
              res.redirect("/home");
            } else {
              res.redirect("/login");
            }
          }
        );
      }, 200);
    }
  );
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
router.get("/trabalho-realizado", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/trabalhoRealizado/index", req.session);
  } else {
    res.redirect("/login");
  }
});
router.get("/trabalho-realizado/:id", function (req, res) {
  dbConnection.query(
    "SELECT * FROM trabalhos_realizados WHERE ?",
    { cod_trabalho: req.params.id },
    (error, results) => {
      if (error) {
        return reject(error);
      }
      req.trabalhos_realizados = results;
      req.trabalhos_realizados.id_colaboradora = results[0].id_colaboradora;
      if (
        req.session.usu_colaboradora_autenticado_id ==
        req.trabalhos_realizados.id_colaboradora
      ) {
        res.render("pages/formColaboradora/trabalhoRealizado/index", {
          session: req.session,
          trabalhos_realizados: req.certificacao,
        });
      } else if (req.session.autenticado === true) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  );
});
router.get("/certificacao", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/certificacao/index", req.session);
  } else {
    res.redirect("/login");
  }
});
router.get("/certificacao/:id", function (req, res) {
  dbConnection.query(
    "SELECT * FROM certificacao WHERE ?",
    { cod_certificacao: req.params.id },
    (error, results) => {
      if (error) {
        return reject(error);
      }
      req.certificacao = results;
      req.certificacao.id_colaboradora = results[0].id_colaboradora;
      if (
        req.session.usu_colaboradora_autenticado_id ==
        req.certificacao.id_colaboradora
      ) {
        res.render("pages/formColaboradora/certificacao/index", {
          session: req.session,
          certificacao: req.certificacao,
        });
      } else if (req.session.autenticado === true) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  );
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

router.get("/fotoperfil", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/fotoperfil/index", req.session);
  } else {
    res.redirect("/login");
  }
});

router.get("/profissao", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/profissao/index", req.session);
  } else if (req.session.autenticado === true) {
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});
router.get("/todas-categorias", function (req, res) {
  res.render("pages/todasCategorias/index", req.session);
});
router.get("/todos-servicos", function (req, res) {
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

router.get("/forma-pagamento", function (req, res) {
  res.render("pages/pagamento/index");
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

module.exports = router;
