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
  dbConnection.query(
    "SELECT * FROM categoria_servico LIMIT 6",
    (error, results) => {
      if (error) {
        return console.log(error);
      }
      req.categoria_servico = results;
      setTimeout(function () {
        dbConnection.query(
          "SELECT * FROM usuario_colaboradora ORDER BY criadoEm LIMIT 10",
          (error, results) => {
            if (error) {
              return console.log(error);
            }
            req.usuario_colaboradoras_destaque = results;
            setTimeout(function () {
              req.usuario_colaboradoras_destaque_id = [];
              for (
                let i = 0;
                i < req.usuario_colaboradoras_destaque.length;
                i++
              ) {
                req.usuario_colaboradoras_destaque_id[i] =
                  req.usuario_colaboradoras_destaque[i].id_usuario;
              }
              dbConnection.query(
                "SELECT * FROM usuario WHERE id_usuario in (?) ORDER BY criadoEm",
                [req.usuario_colaboradoras_destaque_id],
                (error, results) => {
                  if (error) {
                    return console.log(error);
                  }
                  for (
                    let i = 0;
                    i < req.usuario_colaboradoras_destaque.length;
                    i++
                  ) {
                    req.usuario_colaboradoras_destaque[i].nome =
                      results[i].nome;
                    if (results[i].foto_perfil == undefined) {
                      req.usuario_colaboradoras_destaque[i].foto_perfil = null;
                    } else {
                      req.usuario_colaboradoras_destaque[i].foto_perfil =
                        results[i].foto_perfil.toString("base64");
                    }
                  }
                }
              );
            }, 200);
            setTimeout(function () {
              res.render("pages/home/index", {
                session: req.session,
                categoria_servico: req.categoria_servico,
                usuario_colaboradoras_destaque:
                  req.usuario_colaboradoras_destaque,
              });
            }, 300);
          }
        );
      }, 200);
    }
  );
});

router.get("/login", function (req, res) {
  if (req.session.autenticado !== true) {
    res.render("pages/login/index", {
      erro: false,
      mensagem: "",
    });
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
  if (req.session.autenticado === true) {
    if (req.session.colaboradora_autenticado === true) {
      dbConnection.query(
        "SELECT cod_profissao FROM profissao_colaboradora WHERE id_colaboradora = ?",
        [req.session.usu_colaboradora_autenticado_id],
        (error, results) => {
          if (error) {
            return console.log(error);
          }
          req.profissao_colaboradora = [];
          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              req.profissao_colaboradora[i] = results[i].cod_profissao;
            }
          } else {
            req.profissao_colaboradora = 0;
          }
          setTimeout(function () {
            dbConnection.query(
              "SELECT * FROM profissao WHERE cod_profissao IN (?)",
              [req.profissao_colaboradora],
              (error, results) => {
                if (error) {
                  console.log(error);
                }
                req.profissao_selecionada_colaboradora = results;
                setTimeout(function () {
                  dbConnection.query(
                    "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
                    [req.session.usu_colaboradora_autenticado_id],
                    (error, results) => {
                      if (error) {
                        return console.log(error);
                      }
                      req.trabalhos_realizados =
                        results[0] !== undefined ? results : null;
                      setTimeout(function () {
                        dbConnection.query(
                          "SELECT * FROM certificacao WHERE id_colaboradora = ?",
                          [req.session.usu_colaboradora_autenticado_id],
                          (error, results) => {
                            if (error) {
                              return console.log(error);
                            }
                            req.certificacoes =
                              results[0] !== undefined ? results : null;
                            res.render("pages/perfilColaboradora/index", {
                              session: req.session,
                              trabalhos_realizados: req.trabalhos_realizados,
                              certificacoes: req.certificacoes,
                              profissao_selecionada_colaboradora:
                                req.profissao_selecionada_colaboradora,
                              certificacao_pag: null,
                            });
                          }
                        );
                      }, 200);
                    }
                  );
                }, 200);
              }
            );
          }, 200);
        }
      );
    } else {
      res.render("pages/perfilCliente/index", { session: req.session });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/perfil/:id", function (req, res) {
  dbConnection.query(
    "SELECT * FROM usuario WHERE id_usuario = ?",
    [req.params.id],
    async function (error, results, fields) {
      if (error) throw error;

      var total = Object.keys(results).length;

      if (total == 1) {
        req.usu_visitado = results[0];
        req.usu_visitado.usu_nome = results[0].nome;
        req.usu_visitado.usu_email = results[0].email;
        req.usu_visitado.usu_tel = results[0].num_tel;
        if (results[0].foto_perfil == undefined) {
          req.usu_visitado.usu_foto = null;
        } else {
          req.usu_visitado.usu_foto = results[0].foto_perfil.toString("base64");
        }
        setTimeout(function () {
          dbConnection.query(
            "SELECT * FROM usuario_colaboradora WHERE id_usuario = ?",
            [req.params.id],
            function (error, results, fields) {
              if (error) throw error;
              var total = Object.keys(results).length;
              if (total == 1) {
                req.usu_visitado.usu_colaboradora_id =
                  results[0].id_colaboradora;
                req.usu_visitado.usu_colaboradora_descricao =
                  results[0].descricao;

                dbConnection.query(
                  "SELECT cod_profissao FROM profissao_colaboradora WHERE id_colaboradora = ?",
                  [req.usu_visitado.usu_colaboradora_id],
                  (error, results) => {
                    if (error) {
                      return console.log(error);
                    }
                    req.profissao_colaboradora = [];
                    if (results.length > 0) {
                      for (let i = 0; i < results.length; i++) {
                        req.profissao_colaboradora[i] =
                          results[i].cod_profissao;
                      }
                    } else {
                      req.profissao_colaboradora = 0;
                    }
                    setTimeout(function () {
                      dbConnection.query(
                        "SELECT * FROM profissao WHERE cod_profissao IN (?)",
                        [req.profissao_colaboradora],
                        (error, results) => {
                          if (error) {
                            console.log(error);
                          }
                          req.profissao_selecionada_colaboradora = results;
                          setTimeout(function () {
                            dbConnection.query(
                              "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
                              [req.usu_visitado.usu_colaboradora_id],
                              (error, results) => {
                                if (error) {
                                  return console.log(error);
                                }
                                req.trabalhos_realizados =
                                  results[0] !== undefined ? results : null;
                                setTimeout(function () {
                                  dbConnection.query(
                                    "SELECT * FROM certificacao WHERE id_colaboradora = ?",
                                    [req.usu_visitado.usu_colaboradora_id],
                                    (error, results) => {
                                      if (error) {
                                        return console.log(error);
                                      }
                                      req.certificacoes =
                                        results[0] !== undefined
                                          ? results
                                          : null;
                                      setTimeout(function () {
                                        dbConnection.query(
                                          "SELECT * FROM favoritos WHERE id_colaboradora = ? AND id_usuario = ?",
                                          [
                                            req.usu_visitado
                                              .usu_colaboradora_id,
                                            req.session.usu_autenticado_id,
                                          ],
                                          (error, results) => {
                                            if (error) {
                                              return console.log(error);
                                            }
                                            req.favoritado =
                                              results[0] !== undefined
                                                ? true
                                                : null;
                                            res.render(
                                              "pages/perfilColaboradora-visãoCliente/index",
                                              {
                                                session: req.session,
                                                usu_visitado: req.usu_visitado,
                                                favoritado: req.favoritado,
                                                trabalhos_realizados:
                                                  req.trabalhos_realizados,
                                                certificacoes:
                                                  req.certificacoes,
                                                profissao_selecionada_colaboradora:
                                                  req.profissao_selecionada_colaboradora,
                                                certificacao_pag: null,
                                              }
                                            );
                                          }
                                        );
                                      }, 200);
                                    }
                                  );
                                }, 200);
                              }
                            );
                          }, 200);
                        }
                      );
                    }, 200);
                  }
                );
              } else {
                res.json("nao encontrado");
              }
            }
          );
        }, 200);
      } else {
        res.json("nao encontrado");
      }
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
    "SELECT cod_profissao FROM profissao_colaboradora WHERE id_colaboradora = ?",
    [req.session.usu_colaboradora_autenticado_id],
    (error, results) => {
      if (error) {
        return console.log(error);
      }
      req.profissao_colaboradora = [];
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          req.profissao_colaboradora[i] = results[i].cod_profissao;
        }
      } else {
        req.profissao_colaboradora = 0;
      }
      setTimeout(function () {
        dbConnection.query(
          "SELECT * FROM profissao WHERE cod_profissao IN (?)",
          [req.profissao_colaboradora],
          (error, results) => {
            if (error) {
              console.log(error);
            }
            req.profissao_selecionada_colaboradora = results;
            setTimeout(function () {
              dbConnection.query(
                "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
                [req.session.usu_colaboradora_autenticado_id],
                (error, results) => {
                  if (error) {
                    return console.log(error);
                  }
                  req.trabalhos_realizados = results;

                  setTimeout(function () {
                    dbConnection.query(
                      "SELECT * FROM certificacao WHERE id_colaboradora = ?",
                      [req.session.usu_colaboradora_autenticado_id],
                      (error, results) => {
                        if (error) {
                          return console.log(error);
                        }
                        req.certificacoes = results;

                        if (req.session.autenticado === true) {
                          res.render(
                            "pages/formColaboradora/criePerfil/index",
                            {
                              session: req.session,
                              trabalhos_realizados: req.trabalhos_realizados,
                              certificacoes: req.certificacoes,
                              profissao_selecionada_colaboradora:
                                req.profissao_selecionada_colaboradora,
                            }
                          );
                        } else {
                          res.redirect("/login");
                        }
                      }
                    );
                  }, 200);
                }
              );
            }, 200);
          }
        );
      }, 200);
    }
  );
});

router.get("/configuracao", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/configuracao/index", { session: req.session });
  } else {
    res.redirect("/login");
  }
});

router.get("/trabalho-realizado", function (req, res) {
  if (req.session.autenticado === true) {
    req.trabalhos_realizados = {
      cod_trabalho: null,
      titulo: null,
      descricao: null,
      imagem_trabalho: null,
    };
    res.render("pages/formColaboradora/trabalhoRealizado/index", {
      session: req.session,
      trabalhos_realizados: req.trabalhos_realizados,
    });
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
        return console.log(error);
      }
      req.trabalhos_realizados = results[0];
      req.trabalhos_realizados.id_colaboradora = results[0].id_colaboradora;
      if (
        req.session.usu_colaboradora_autenticado_id ==
        req.trabalhos_realizados.id_colaboradora
      ) {
        res.render("pages/formColaboradora/trabalhoRealizado/index", {
          session: req.session,
          trabalhos_realizados: req.trabalhos_realizados,
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
    req.certificacao = {
      cod_certificacao: null,
      nome_curso: null,
      atividade_realizada: null,
      data_emissao: null,
      orgao_emissor: null,
      foto_certificacao: null,
    };
    res.render("pages/formColaboradora/certificacao/index", {
      session: req.session,
      certificacao: req.certificacao,
    });
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
        return console.log(error);
      }
      req.certificacao = results[0];
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

router.get("/perfil/certificacao/:cod_certificacao", function (req, res) {
  if (req.session.autenticado === true) {
    if (req.session.colaboradora_autenticado === true) {
      dbConnection.query(
        "SELECT cod_profissao FROM profissao_colaboradora WHERE id_colaboradora = ?",
        [req.session.usu_colaboradora_autenticado_id],
        (error, results) => {
          if (error) {
            return console.log(error);
          }
          req.profissao_colaboradora = [];
          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              req.profissao_colaboradora[i] = results[i].cod_profissao;
            }
          } else {
            req.profissao_colaboradora = 0;
          }
          setTimeout(function () {
            dbConnection.query(
              "SELECT * FROM profissao WHERE cod_profissao IN (?)",
              [req.profissao_colaboradora],
              (error, results) => {
                if (error) {
                  console.log(error);
                }
                req.profissao_selecionada_colaboradora = results;
                setTimeout(function () {
                  dbConnection.query(
                    "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
                    [req.session.usu_colaboradora_autenticado_id],
                    (error, results) => {
                      if (error) {
                        return console.log(error);
                      }
                      req.trabalhos_realizados =
                        results[0] !== undefined ? results : null;
                      setTimeout(function () {
                        dbConnection.query(
                          "SELECT * FROM certificacao WHERE id_colaboradora = ?",
                          [req.session.usu_colaboradora_autenticado_id],
                          (error, results) => {
                            if (error) {
                              return console.log(error);
                            }
                            req.certificacoes =
                              results[0] !== undefined ? results : null;
                            setTimeout(function () {
                              dbConnection.query(
                                "SELECT * FROM certificacao WHERE id_colaboradora = ?",
                                [req.session.usu_colaboradora_autenticado_id],
                                (error, results) => {
                                  if (error) {
                                    return console.log(error);
                                  }
                                  req.certificacoes =
                                    results[0] !== undefined ? results : null;
                                  setTimeout(function () {
                                    dbConnection.query(
                                      "SELECT * FROM certificacao WHERE cod_certificacao = ?",
                                      [req.params.cod_certificacao],
                                      (error, results) => {
                                        if (error) {
                                          return console.log(error);
                                        }
                                        req.certificacao_pag =
                                          results[0] !== undefined
                                            ? results
                                            : null;
                                        res.render(
                                          "pages/perfilColaboradora/index",
                                          {
                                            session: req.session,
                                            trabalhos_realizados:
                                              req.trabalhos_realizados,
                                            certificacoes: req.certificacoes,
                                            profissao_selecionada_colaboradora:
                                              req.profissao_selecionada_colaboradora,
                                            certificacao_pag:
                                              req.certificacao_pag,
                                          }
                                        );
                                      }
                                    );
                                  }, 200);
                                }
                              );
                            }, 200);
                          }
                        );
                      }, 200);
                    }
                  );
                }, 200);
              }
            );
          }, 200);
        }
      );
    } else {
      res.render("pages/perfilCliente/index", { session: req.session });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/perfil/:id/certificacao/:cod_certificacao", function (req, res) {
  dbConnection.query(
    "SELECT * FROM usuario WHERE id_usuario = ?",
    [req.params.id],
    async function (error, results, fields) {
      if (error) throw error;

      var total = Object.keys(results).length;

      if (total == 1) {
        req.usu_visitado = results[0];
        req.usu_visitado.usu_nome = results[0].nome;
        req.usu_visitado.usu_email = results[0].email;
        req.usu_visitado.usu_tel = results[0].num_tel;
        if (results[0].foto_perfil == undefined) {
          req.usu_visitado.usu_foto = null;
        } else {
          req.usu_visitado.usu_foto = results[0].foto_perfil.toString("base64");
        }
        setTimeout(function () {
          dbConnection.query(
            "SELECT * FROM usuario_colaboradora WHERE id_usuario = ?",
            [req.params.id],
            function (error, results, fields) {
              if (error) throw error;
              var total = Object.keys(results).length;
              if (total == 1) {
                req.usu_visitado.usu_colaboradora_id =
                  results[0].id_colaboradora;
                req.usu_visitado.usu_colaboradora_descricao =
                  results[0].descricao;

                dbConnection.query(
                  "SELECT cod_profissao FROM profissao_colaboradora WHERE id_colaboradora = ?",
                  [req.usu_visitado.usu_colaboradora_id],
                  (error, results) => {
                    if (error) {
                      return console.log(error);
                    }
                    req.profissao_colaboradora = [];
                    if (results.length > 0) {
                      for (let i = 0; i < results.length; i++) {
                        req.profissao_colaboradora[i] =
                          results[i].cod_profissao;
                      }
                    } else {
                      req.profissao_colaboradora = 0;
                    }
                    setTimeout(function () {
                      dbConnection.query(
                        "SELECT * FROM profissao WHERE cod_profissao IN (?)",
                        [req.profissao_colaboradora],
                        (error, results) => {
                          if (error) {
                            console.log(error);
                          }
                          req.profissao_selecionada_colaboradora = results;
                          setTimeout(function () {
                            dbConnection.query(
                              "SELECT * FROM trabalhos_realizados WHERE id_colaboradora = ?",
                              [req.usu_visitado.usu_colaboradora_id],
                              (error, results) => {
                                if (error) {
                                  return console.log(error);
                                }
                                req.trabalhos_realizados =
                                  results[0] !== undefined ? results : null;
                                setTimeout(function () {
                                  dbConnection.query(
                                    "SELECT * FROM certificacao WHERE id_colaboradora = ?",
                                    [req.usu_visitado.usu_colaboradora_id],
                                    (error, results) => {
                                      if (error) {
                                        return console.log(error);
                                      }
                                      req.certificacoes =
                                        results[0] !== undefined
                                          ? results
                                          : null;
                                      setTimeout(function () {
                                        dbConnection.query(
                                          "SELECT * FROM certificacao WHERE cod_certificacao = ?",
                                          [req.params.cod_certificacao],
                                          (error, results) => {
                                            if (error) {
                                              return console.log(error);
                                            }
                                            req.certificacao_pag =
                                              results[0] !== undefined
                                                ? results
                                                : null;
                                            res.render(
                                              "pages/perfilColaboradora-visãoCliente/index",
                                              {
                                                session: req.session,
                                                usu_visitado: req.usu_visitado,
                                                trabalhos_realizados:
                                                  req.trabalhos_realizados,
                                                certificacoes:
                                                  req.certificacoes,
                                                profissao_selecionada_colaboradora:
                                                  req.profissao_selecionada_colaboradora,
                                                certificacao_pag:
                                                  req.certificacao_pag,
                                              }
                                            );
                                          }
                                        );
                                      }, 200);
                                    }
                                  );
                                }, 200);
                              }
                            );
                          }, 200);
                        }
                      );
                    }, 200);
                  }
                );
              } else {
                res.json("nao encontrado");
              }
            }
          );
        }, 200);
      } else {
        res.json("nao encontrado");
      }
    }
  );
});

router.get("/profissao", function (req, res) {
  if (req.session.colaboradora_autenticado === true) {
    dbConnection.query("SELECT * FROM profissao", (error, results) => {
      if (error) {
        return console.log(error);
      }
      req.profissao = results;

      setTimeout(function () {
        dbConnection.query(
          "SELECT cod_profissao FROM profissao_colaboradora WHERE id_colaboradora = ?",
          [req.session.usu_colaboradora_autenticado_id],
          (error, results) => {
            if (error) {
              return console.log(error);
            }
            req.profissao_colaboradora = [];
            if (results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                req.profissao_colaboradora[i] = results[i].cod_profissao;
              }
            } else {
              req.profissao_colaboradora = 0;
            }

            setTimeout(function () {
              dbConnection.query(
                "SELECT * FROM profissao WHERE cod_profissao IN (?)",
                [req.profissao_colaboradora],
                (error, results) => {
                  if (error) {
                    console.log(error);
                  }
                  req.profissao_selecionada_colaboradora = results;

                  res.render("pages/formColaboradora/profissao/index", {
                    session: req.session,
                    profissao: req.profissao,
                    profissao_selecionada_colaboradora:
                      req.profissao_selecionada_colaboradora,
                  });
                }
              );
            }, 200);
          }
        );
      }, 200);
    });
  } else if (req.session.autenticado === true) {
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

router.get("/historico", function (req, res) {
  res.render("pages/historico/index", { session: req.session });
});

router.get("/pedidos", function (req, res) {
  res.render("pages/pedidos/index", { session: req.session });
});

router.get("/planos", function (req, res) {
  res.render("pages/planos/index", { session: req.session });
});

router.get("/recuperar-senha", function (req, res) {
  res.render("pages/recuperar/index", { session: req.session });
});

router.get("/recuperar-senha-passo2", function (req, res) {
  res.render("pages/recuperar-passo2/index", { session: req.session });
});

router.get("/cadastre-se", function (req, res) {
  res.render("pages/cadastre-se/index", { erros: null, valores: "" });
});

router.get("/fotoperfil", function (req, res) {
  if (req.session.autenticado === true) {
    res.render("pages/formColaboradora/fotoperfil/index", {
      session: req.session,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/todas-categorias", function (req, res) {
  dbConnection.query("SELECT * FROM categoria_servico", (error, results) => {
    if (error) {
      return console.log(error);
    }
    req.categoria_servico = results;
    res.render("pages/todasCategorias/index", {
      session: req.session,
      categoria_servico: req.categoria_servico,
    });
  });
});

router.get("/pesquisar", function (req, res) {
  res.render("pages/todosServiços/index", { session: req.session });
});

router.get("/favoritos", function (req, res) {
  if (req.session.autenticado === true) {
    dbConnection.query(
      "SELECT id_colaboradora FROM favoritos WHERE id_usuario = ?",
      [req.session.usu_autenticado_id],
      (error, results) => {
        if (error) {
          return console.log(error);
        }
        if (results[0] === undefined) {  
          req.favoritos = "null";
        } else {
          req.favoritos = [];
          for (let i = 0; i < results.length; i++) {
            req.favoritos[i] = results[i].id_colaboradora;
          }
        }
        setTimeout(function () {
          dbConnection.query(
            "SELECT id_usuario FROM usuario_colaboradora WHERE id_colaboradora IN (?)",
            [req.favoritos],
            (error, results) => {
              if (error) {
                console.log(error);
              }

              req.usuario_colaboradoras_favoritos = [];
              if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                  req.usuario_colaboradoras_favoritos[i] =
                    results[i].id_usuario;
                }
              } else {
                req.usuario_colaboradoras_favoritos = null;
              }
              setTimeout(function () {
                dbConnection.query(
                  "SELECT * FROM usuario WHERE id_usuario IN (?)",
                  [req.usuario_colaboradoras_favoritos],
                  (error, results) => {
                    if (error) {
                      console.log(error);
                    }
                    if (results.length > 0) {
                      req.usuario_colaboradoras_favoritos = JSON.parse(
                        JSON.stringify(results)
                      );
                      for (let i = 0; i < results.length; i++) {
                        if (results[i].foto_perfil == undefined) {
                          req.usuario_colaboradoras_favoritos[i].foto_perfil =
                            null;
                        } else {
                          req.usuario_colaboradoras_favoritos[i].foto_perfil =
                            results[i].foto_perfil.toString("base64");
                        }
                      }
                    } else {
                      req.usuario_colaboradoras_favoritos = null;
                    }
                    if (req.usuario_colaboradoras_favoritos === null) {
                      res.render("pages/favoritos/index", {
                        session: req.session,
                        favoritos: req.favoritos,
                        usuario_colaboradoras_favoritos:
                          req.usuario_colaboradoras_favoritos,
                      });
                    } else {
                      setTimeout(async function () {
                        for (
                          let i = 0;
                          i < req.usuario_colaboradoras_favoritos.length;
                          i++
                        ) {
                          await dbConnection.query(
                            "SELECT * FROM usuario_colaboradora WHERE id_usuario = ?",
                            [req.usuario_colaboradoras_favoritos[i].id_usuario],
                            (error, results) => {
                              if (error) {
                                return console.log(error);
                              }
                              req.usuario_colaboradoras_favoritos[i].descricao =
                                [];
                              req.usuario_colaboradoras_favoritos[
                                i
                              ].id_colaboradora = [];
                              for (let x = 0; x < results.length; x++) {
                                req.usuario_colaboradoras_favoritos[
                                  i
                                ].descricao[x] = results[x].descricao;
                                req.usuario_colaboradoras_favoritos[
                                  i
                                ].id_colaboradora[x] =
                                  results[x].id_colaboradora;
                              }
                              setTimeout(function () {
                                dbConnection.query(
                                  "SELECT * FROM favoritos WHERE id_colaboradora = ? AND id_usuario = ?",
                                  [
                                    req.usuario_colaboradoras_favoritos[i]
                                      .id_colaboradora,
                                    req.session.usu_autenticado_id,
                                  ],
                                  (error, results) => {
                                    if (error) {
                                      return console.log(error);
                                    }
                                    req.usuario_colaboradoras_favoritos[
                                      i
                                    ].favoritado = [];
                                    for (let x = 0; x < results.length; x++) {
                                      req.usuario_colaboradoras_favoritos[
                                        i
                                      ].favoritado[x] =
                                        results[x] !== undefined ? true : null;
                                    }
                                  }
                                );
                              }, 200);
                            }
                          );
                        }
                        setTimeout(function () {
                          res.render("pages/favoritos/index", {
                            session: req.session,
                            favoritos: req.favoritos,
                            usuario_colaboradoras_favoritos:
                              req.usuario_colaboradoras_favoritos,
                          });
                        }, 500);
                      }, 200);
                    }
                  }
                );
              }, 200);
            }
          );
        }, 200);
      }
    );
  } else {
    res.render("pages/favoritos/index", {
      session: req.session,
      favoritos: null,
      usuario_colaboradoras_favoritos: null,
    });
  }
});

router.get("/cartao", function (req, res) {
  res.render("pages/cartao/index", { session: req.session });
});

router.get("/pagamento", function (req, res) {
  res.render("pages/sucesso/index", { session: req.session });
});

router.get("/forma-pagamento", function (req, res) {
  res.render("pages/pagamento/index", { session: req.session });
});

router.get("/categorias-profissoes/:id", function (req, res) {
  autenticado =
    req.session.autenticado === true
      ? { autenticado: req.session.usu_autenticado_id }
      : { autenticado: null };
  dbConnection.query(
    "SELECT * FROM categoria_servico WHERE ?",
    { cod_cat_servico: req.params.id },
    (error, results) => {
      if (error) {
        return console.log(error);
      }
      req.selected_categoria_servico = results;
      setTimeout(function () {
        dbConnection.query(
          "SELECT * FROM categoria_servico WHERE cod_cat_servico <> ?",
          [req.params.id],
          (error, results) => {
            if (error) {
              return console.log(error);
            }
            req.categoria_servico = results;
            setTimeout(function () {
              dbConnection.query(
                "SELECT * FROM profissao WHERE ?",
                { cod_cat_servico: req.params.id },
                (error, results) => {
                  if (error) {
                    return console.log(error);
                  }
                  req.profissao = results;
                  res.render("pages/categorias_profissoes/index", {
                    session: req.session,
                    selected_categoria_servico: req.selected_categoria_servico,
                    categoria_servico: req.categoria_servico,
                    profissao: req.profissao,
                  });
                }
              );
            }, 200);
          }
        );
      }, 200);
    }
  );
});

router.get("/solicitar/:id", async function (req, res) {
  await dbConnection.query(
    "SELECT * FROM profissao WHERE cod_profissao = ?",
    [req.params.id],
    (error, results) => {
      if (error) {
        return console.log(error);
      }
      req.profissao = results[0];
      setTimeout(function () {
        dbConnection.query(
          "SELECT id_colaboradora FROM profissao_colaboradora WHERE cod_profissao = ?",
          [req.params.id],
          (error, results) => {
            if (error) {
              return console.log(error);
            }
            req.colaboradoras_profissao = [];
            if (results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                req.colaboradoras_profissao[i] = results[i].id_colaboradora;
              }
            } else {
              req.colaboradoras_profissao = null;
            }
            setTimeout(function () {
              dbConnection.query(
                "SELECT id_usuario FROM usuario_colaboradora WHERE id_colaboradora IN (?)",
                [req.colaboradoras_profissao],
                (error, results) => {
                  if (error) {
                    console.log(error);
                  }
                  req.usuario_colaboradoras_profissao = [];
                  if (results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                      req.usuario_colaboradoras_profissao[i] =
                        results[i].id_usuario;
                    }
                  } else {
                    req.usuario_colaboradoras_profissao = null;
                  }
                  setTimeout(function () {
                    dbConnection.query(
                      "SELECT * FROM usuario WHERE id_usuario IN (?) ORDER BY criadoEm",
                      [req.usuario_colaboradoras_profissao],
                      (error, results) => {
                        if (error) {
                          console.log(error);
                        }
                        if (results.length > 0) {
                          req.usuario_colaboradoras_profissao = JSON.parse(
                            JSON.stringify(results)
                          );
                          for (let i = 0; i < results.length; i++) {
                            if (results[i].foto_perfil == undefined) {
                              req.usuario_colaboradoras_profissao[
                                i
                              ].foto_perfil = null;
                            } else {
                              req.usuario_colaboradoras_profissao[
                                i
                              ].foto_perfil =
                                results[i].foto_perfil.toString("base64");
                            }
                          }
                        } else {
                          req.usuario_colaboradoras_profissao = null;
                        }
                        if (req.usuario_colaboradoras_profissao === null) {
                          res.render("pages/solicitar/index", {
                            session: req.session,
                            profissao: req.profissao,
                            usuario_colaboradoras_profissao:
                              req.usuario_colaboradoras_profissao,
                          });
                        } else {
                          setTimeout(async function () {
                            for (
                              let i = 0;
                              i < req.usuario_colaboradoras_profissao.length;
                              i++
                            ) {
                              await dbConnection.query(
                                "SELECT * FROM usuario_colaboradora WHERE id_usuario = ?",
                                [
                                  req.usuario_colaboradoras_profissao[i]
                                    .id_usuario,
                                ],
                                (error, results) => {
                                  if (error) {
                                    return console.log(error);
                                  }
                                  req.usuario_colaboradoras_profissao[
                                    i
                                  ].descricao = [];
                                  req.usuario_colaboradoras_profissao[
                                    i
                                  ].id_colaboradora = [];
                                  for (let x = 0; x < results.length; x++) {
                                    req.usuario_colaboradoras_profissao[
                                      i
                                    ].descricao[x] = results[x].descricao;
                                    req.usuario_colaboradoras_profissao[
                                      i
                                    ].id_colaboradora[x] =
                                      results[x].id_colaboradora;
                                  }
                                  setTimeout(function () {
                                    dbConnection.query(
                                      "SELECT * FROM favoritos WHERE id_colaboradora = ? AND id_usuario = ?",
                                      [
                                        req.usuario_colaboradoras_profissao[i]
                                          .id_colaboradora,
                                        req.session.usu_autenticado_id,
                                      ],
                                      (error, results) => {
                                        if (error) {
                                          return console.log(error);
                                        }
                                        req.usuario_colaboradoras_profissao[
                                          i
                                        ].favoritado = [];
                                        for (
                                          let x = 0;
                                          x < results.length;
                                          x++
                                        ) {
                                          req.usuario_colaboradoras_profissao[
                                            i
                                          ].favoritado[x] =
                                            results[x] !== undefined
                                              ? true
                                              : null;
                                        }
                                      }
                                    );
                                  }, 200);
                                }
                              );
                            }
                            setTimeout(function () {
                              res.render("pages/solicitar/index", {
                                session: req.session,
                                profissao: req.profissao,
                                usuario_colaboradoras_profissao:
                                  req.usuario_colaboradoras_profissao,
                              });
                            }, 600);
                          }, 200);
                        }
                      }
                    );
                  }, 200);
                }
              );
            }, 200);
          }
        );
      }, 200);
    }
  );
});

module.exports = router;
