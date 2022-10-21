const express = require("express");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
var dbConnection = require("../../config/database");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const imageMemoryStorage = multer.memoryStorage();
const uploadImage = multer({ storage: imageMemoryStorage });

const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/cadastre-se",
  body("nome").isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
  body("nome").not().isEmpty().withMessage("Preencha esse campo"),
  body("nome")
    .isLength({ max: 100 })
    .withMessage("Não ultrapasse 100 caracteres"),
  body("tel", "Número inválido")
    .escape()
    .exists({ checkFalsy: true })
    .matches(/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/),
  body("tel").not().isEmpty().withMessage("Preencha esse campo"),
  body("email", "Insira um formato de e-mail válido").isEmail(),
  body("email").not().isEmpty().withMessage("Preencha esse campo"),
  body("senha").isLength({ min: 8, max: 100 }).withMessage("Mínimo 8 dígitos!"),
  body("senha", "Preencha esse campo").not().isEmpty(),
  body("conf_senha", "As senhas não são compatíveis").custom(
    (value, { req }) => value === req.body.senha
  ),
  body("termos", "Você precisa aceitar os Termos de uso").exists({
    checkFalsy: true,
  }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("pages/cadastre-se/index", {
        erros: errors,
        valores: req.body,
      });
    }

    var dadosForm = {
      id_usuario: uuidv4(),
      nome: req.body.nome,
      num_tel: req.body.tel,
      email: req.body.email,
      senha: bcrypt.hashSync(req.body.senha, salt),
      criadoEm: new Date(),
    };
    dbConnection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [dadosForm.email],
      async function (error, results, fields) {
        if (error) throw error;
        var total = Object.keys(results).length;

        if (total == 1) {
          return res.render("pages/cadastre-se/index", {
            erros: {
              errors: [
                {
                  value: "",
                  msg: "Este endereço de email já foi usado. escolha outro",
                  param: "email",
                  location: "body",
                },
              ],
            },
            valores: req.body,
          });
        } else if (total < 1) {
          dbConnection.query(
            "INSERT INTO usuario SET ?",
            dadosForm,
            function (error, results, fields) {
              if (error) throw error;
            }
          );
        }
        res.redirect("/login");
      }
    );
  }
);
router.post(
  "/excluir-perfil",

  function (req, res) {
    dbConnection.query(
      "DELETE FROM usuario WHERE id_usuario = ?",
      [req.session.usu_autenticado_id],
      req.session.destroy(),
      res.redirect("/")
    );
  }
);

router.post(
  "/login",

  async function (req, res) {
    var dadosForm = {
      login: req.body.email,
      senha: req.body.senha,
      keepSession: req.body.keepSession,
    };

    await dbConnection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [dadosForm.login],
      async function (error, results, fields) {
        if (error) throw error;
        var total = Object.keys(results).length;

        if (total < 1) {
          return res.render("pages/login/index", {
            erro: true,
            mensagem: "Email e/ou senha incorretos!",
          });
        } else if (total == 1) {
          if (bcrypt.compareSync(dadosForm.senha, results[0].senha)) {
            req.session.autenticado = true;
            req.session.usu_autenticado_id = results[0].id_usuario;
            req.session.usu_autenticado_cpf = results[0].cpf_usuario;
            req.session.usu_autenticado_nome = results[0].nome;
            req.session.usu_autenticado_email = results[0].email;
            req.session.usu_autenticado_tel = results[0].num_tel;
            req.session.usu_autenticado_cep = results[0].cep;
            /* req.session.usu_autenticado_foto = results[0].foto_perfil; */
            if (results[0].foto_perfil == undefined) {
              req.session.usu_autenticado_foto = null;
            } else {
              req.session.usu_autenticado_foto =
                results[0].foto_perfil.toString("base64");
            }

            await dbConnection.query(
              "SELECT * FROM usuario_colaboradora WHERE id_usuario = ?",
              [req.session.usu_autenticado_id],
              function (error, results, fields) {
                if (error) throw error;
                var total = Object.keys(results).length;
                if (total == 1) {
                  req.session.colaboradora_autenticado = true;
                  req.session.usu_colaboradora_autenticado_id =
                    results[0].id_colaboradora;
                  req.session.usu_colaboradora_autenticado_descricao =
                    results[0].descricao;
                }
                res.redirect("/");
              }
            );
          } else {
            return res.render("pages/login/index", {
              erro: true,
              mensagem: "Email e/ou senha incorretos!",
            });
          }
        }
      }
    );
  }
);
router.post(
  "/configuracao",
  uploadImage.single("userImage"),

  function (req, res) {
    let fileContent;
    if (!req.file) {
      fileContent = null;
    } else {
      fileContent = req.file.buffer;
    }

    var dadosForm = {
      nome: req.body.nome,
      email: req.body.email,
      tel: req.body.tel,
      cep: req.body.cep,
      fotoPerfil: fileContent,
      id_usuario: req.session.usu_autenticado_id,
      /* senha: bcrypt.hashSync(req.body.senha, salt), */
    };

    dbConnection.query(
      "UPDATE usuario SET nome = ?, email = ?, num_tel = ?, cep = ?, foto_perfil = ? WHERE id_usuario = ?",
      [
        dadosForm.nome,
        dadosForm.email,
        dadosForm.tel,
        dadosForm.cep,
        dadosForm.fotoPerfil,
        dadosForm.id_usuario,
      ],
      function (error, results, fields) {
        if (error) throw error;
      }
    );

    setTimeout(function () {
      dbConnection.query(
        "SELECT * FROM usuario WHERE id_usuario = ?",
        [req.session.usu_autenticado_id],
        function (error, results, fields) {
          if (error) throw error;

          req.session.usu_autenticado_nome = results[0].nome;
          req.session.usu_autenticado_email = results[0].email;
          req.session.usu_autenticado_tel = results[0].num_tel;
          req.session.usu_autenticado_cep = results[0].cep;
          if (results[0].foto_perfil == undefined) {
            req.session.usu_autenticado_foto = null;
          } else {
            req.session.usu_autenticado_foto =
              results[0].foto_perfil.toString("base64");
          }
          if (req.session.colaboradora_autenticado === true) {
            res.redirect("/editarperfil");
          } else {
            res.redirect("/perfil");
          }
        }
      );
    }, 200);
  }
);
router.post(
  "/crie-perfil-profissional",

  body("descricao").isLength({ min: 0, max: 500 }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      // return res.render("pages/html", { erros: errors, dados: req.body });
      return res.json(errors);
    }

    var dadosForm = {
      id_colaboradora: uuidv4(),
      id_usuario: req.session.usu_autenticado_id,
      descricao: req.body.descricao,
      criadoEm: new Date(),
    };

    dbConnection.query(
      "INSERT INTO usuario_colaboradora SET ?",
      dadosForm,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    setTimeout(function () {
      dbConnection.query(
        "SELECT * FROM usuario_colaboradora WHERE id_usuario = ?",
        [dadosForm.id_usuario],
        function (error, results, fields) {
          if (error) throw error;
          req.session.colaboradora_autenticado = true;
          req.session.usu_colaboradora_autenticado_id =
            results[0].id_colaboradora;
          req.session.usu_colaboradora_autenticado_descricao =
            results[0].descricao;

          res.redirect("/perfil");
        }
      );
    }, 200);
  }
);
router.post(
  "/atualizar-perfil-profissional",

  function (req, res) {
    var dadosForm = {
      descricao: req.body.descricao,
    };
    dbConnection.query(
      "UPDATE usuario_colaboradora SET descricao = ? WHERE id_colaboradora = ?",
      [req.body.descricao, req.session.usu_colaboradora_autenticado_id],
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    setTimeout(function () {
      dbConnection.query(
        "SELECT * FROM usuario_colaboradora WHERE id_colaboradora = ?",
        [req.session.usu_colaboradora_autenticado_id],
        function (error, results, fields) {
          if (error) throw error;
          req.session.usu_colaboradora_autenticado_descricao =
            results[0].descricao;
          res.redirect("/perfil");
        }
      );
    }, 200);
  }
);
router.post(
  "/fotoperfil",
  uploadImage.single("userImage"),

  function (req, res) {
    let fileContent;
    if (!req.file) {
      fileContent = null;
    } else {
      fileContent = req.file.buffer;
    }

    var dadosForm = {
      fotoPerfil: fileContent,
      id_usuario: req.session.usu_autenticado_id,
    };

    dbConnection.query(
      "UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?",
      [dadosForm.fotoPerfil, dadosForm.id_usuario],
      function (error, results, fields) {
        if (error) throw error;
      }
    );

    setTimeout(function () {
      dbConnection.query(
        "SELECT * FROM usuario WHERE id_usuario = ?",
        [req.session.usu_autenticado_id],
        function (error, results, fields) {
          if (error) throw error;

          if (results[0].foto_perfil == undefined) {
            req.session.usu_autenticado_foto = null;
          } else {
            req.session.usu_autenticado_foto =
              results[0].foto_perfil.toString("base64");
          }
          res.redirect("/editarperfil");
        }
      );
    }, 200);
  }
);
router.post(
  "/add-certificacao",
  uploadImage.single("foto_certificacao"),

  async function (req, res) {
    let fileContent;
    if (!req.file) {
      fileContent = null;
    } else {
      fileContent = req.file.buffer.toString("base64");
    }

    var dadosForm = {
      cod_certificacao: uuidv4(),
      nome_curso: req.body.nome_curso,
      atividade_realizada: req.body.atividade_realizada,
      data_emissao: req.body.data_emissao,
      orgao_emissor: req.body.orgao_emissor,
      foto_certificacao: fileContent,
      id_colaboradora: req.session.usu_colaboradora_autenticado_id,
    };

    await dbConnection.query(
      "INSERT INTO certificacao SET ?",
      dadosForm,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    res.redirect("/editarperfil");
  }
);
router.post(
  "/update-certificacao/:id",
  uploadImage.single("foto_certificacao"),

  async function (req, res) {
    let fileContent;
    if (!req.file) {
      fileContent = null;
    } else {
      fileContent = req.file.buffer.toString("base64");
    }

    var dadosForm = {
      nome_curso: req.body.nome_curso,
      atividade_realizada: req.body.atividade_realizada,
      data_emissao: req.body.data_emissao,
      orgao_emissor: req.body.orgao_emissor,
      foto_certificacao: fileContent,
    };

    await dbConnection.query(
      "UPDATE certificacao SET ?",
      [dadosForm, req.params.id],
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    res.redirect("/editarperfil");
  }
);
router.post("/remove-certificacao/:id", function (req, res) {
  dbConnection.query(
    "DELETE FROM certificacao WHERE ?",
    req.params.id,
    function (error, results, fields) {
      if (error) throw error;
      res.redirect("/editarperfil");
    }
  );
});
router.post(
  "/add-trabalho",
  uploadImage.single("imagem_trabalho"),

  async function (req, res) {
    let fileContent;
    if (!req.file) {
      fileContent = null;
    } else {
      fileContent = req.file.buffer.toString("base64");
    }

    var dadosForm = {
      cod_trabalho: uuidv4(),
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      imagem_trabalho: fileContent,
      id_colaboradora: req.session.usu_colaboradora_autenticado_id,
    };

    await dbConnection.query(
      "INSERT INTO trabalhos_realizados SET ?",
      dadosForm,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    res.redirect("/editarperfil");
  }
);
router.post(
  "/update-trabalho/:id",
  uploadImage.single("imagem_trabalho"),

  async function (req, res) {
    let fileContent;
    if (!req.file) {
      fileContent = null;
    } else {
      fileContent = req.file.buffer.toString("base64");
    }

    var dadosForm = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      imagem_trabalho: fileContent,
    };

    await dbConnection.query(
      "UPDATE trabalhos_realizados SET ? WHERE cod_trabalho = ?",
      [dadosForm, req.params.id],
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    res.redirect("/editarperfil");
  }
);
router.post("/remove-trabalho/:id", function (req, res) {
  dbConnection.query(
    "DELETE FROM trabalhos_realizados WHERE ?",
    req.params.id,
    function (error, results, fields) {
      if (error) throw error;
      res.redirect("/editarperfil");
    }
  );
});
router.post("/add-profissao", function (req, res) {
  var dadosForm = {
    cod_profissao: req.body.cod_profissao,
    id_colaboradora: req.session.usu_colaboradora_autenticado_id,
  };
  dbConnection.query(
    "SELECT * FROM profissao_colaboradora WHERE cod_profissao = ? AND id_colaboradora = ?",
    [dadosForm.cod_profissao, dadosForm.id_colaboradora],
    function (error, results, fields) {
      if (error) throw error;
      if (results[0] === undefined) {
        dbConnection.query(
          "INSERT INTO profissao_colaboradora SET ?",
          dadosForm,
          function (error, results, fields) {
            if (error) throw error;
            res.redirect("/profissao");
          }
        );
      } else {
        dbConnection.query(
          "DELETE FROM profissao_colaboradora WHERE id_colaboradora = ?",
          [dadosForm.id_colaboradora],
          function (error, results, fields) {
            if (error) throw error;
            res.redirect("/profissao");
          }
        );
      }
    }
  );
});
router.post("/remove-profissao", function (req, res) {
  var dadosForm = {
    cod_profissao: req.body.cod_profissao,
  };
  dbConnection.query(
    "DELETE FROM profissao_colaboradora WHERE ?",
    dadosForm,
    function (error, results, fields) {
      if (error) throw error;
      res.redirect("/profissao");
    }
  );
});
router.post("/solicitar/:cod_profissao", function (req, res) {
  if (req.session.autenticado === true) {
    var dadosForm = {
      cod_solicitacao: uuidv4(),
      mensagem: req.body.mensagem,
      status_solicitacao: "Pendente",
      data_requisicao: new Date(),
      periodo: req.body.periodo,
      id_usuario: req.session.usu_autenticado_id,
    };
    dbConnection.query(
      "SELECT id_colaboradora FROM profissao_colaboradora WHERE cod_profissao = ?",
      [req.params.cod_profissao],
      function (error, results, fields) {
        if (error) throw error;
        req.colaboradoras_profissoes = [];
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            req.colaboradoras_profissoes[i] = results[i].id_colaboradora;
          }
        } else {
          req.colaboradoras_profissoes = null;
        }
        if (results.length > 0) {
          dbConnection.query(
            "INSERT INTO solicitacao SET ?",
            dadosForm,
            function (error, results, fields) {
              if (error) throw error;
              setTimeout(async function () {
                for (let i = 0; i < req.colaboradoras_profissoes.length; i++) {
                  await dbConnection.query(
                    "INSERT INTO solicitacao_colaboradora SET cod_solicitacao = ?, id_colaboradora = ?",
                    [
                      dadosForm.cod_solicitacao,
                      req.colaboradoras_profissoes[i],
                    ],
                    function (error, results, fields) {
                      if (error) throw error;
                      if (
                        req.colaboradoras_profissoes[i] ==
                        req.session.usu_colaboradora_autenticado_id
                      ) {
                        dbConnection.query(
                          "DELETE FROM solicitacao_colaboradora WHERE cod_solicitacao = ? AND id_colaboradora = ?",
                          [
                            dadosForm.cod_solicitacao,
                            req.colaboradoras_profissoes[i],
                          ],
                          function (error, results, fields) {
                            if (error) throw error;
                          }
                        );
                      }
                    }
                  );
                }
                res.redirect("/solicitar/" + req.params.cod_profissao + "/1");
              }, 200);
            }
          );
        } else {
          dbConnection.query(
            "INSERT INTO solicitacao SET ?",
            dadosForm,
            function (error, results, fields) {
              if (error) throw error;
              res.redirect("/solicitar/" + req.params.cod_profissao + "/2");
            }
          );
        }
      }
    );
  } else {
    res.redirect("/solicitar/" + req.params.cod_profissao + "/3");
  }
});
router.post("/solicitar-profissional/:id_colaboradora", function (req, res) {
  if (req.session.autenticado === true) {
    var dadosForm = {
      cod_solicitacao: uuidv4(),
      mensagem: req.body.mensagem,
      status_solicitacao: "Pendente",
      data_requisicao: new Date(),
      periodo: req.body.periodo,
      id_usuario: req.session.usu_autenticado_id,
    };

    dbConnection.query(
      "INSERT INTO solicitacao SET ?",
      dadosForm,
      function (error, results, fields) {
        if (error) throw error;
        setTimeout(async function () {
          for (let i = 0; i < req.colaboradoras_profissoes.length; i++) {
            await dbConnection.query(
              "INSERT INTO solicitacao_colaboradora SET cod_solicitacao = ?, id_colaboradora = ?",
              [
                dadosForm.cod_solicitacao,
                req.params.id_colaboradora,
              ],
              function (error, results, fields) {
                if (error) throw error;
                if (
                  req.colaboradoras_profissoes[i] ==
                  req.session.usu_colaboradora_autenticado_id
                ) {
                  dbConnection.query(
                    "DELETE FROM solicitacao_colaboradora WHERE cod_solicitacao = ? AND id_colaboradora = ?",
                    [
                      dadosForm.cod_solicitacao,
                      req.colaboradoras_profissoes[i],
                    ],
                    function (error, results, fields) {
                      if (error) throw error;
                    }
                  );
                }
              }
            );
          }
          res.redirect("/perfil/" + req.params.id_colaboradora + "/1");
        }, 200);
      }
    );
  } else {
    res.redirect("/perfil/" + req.params.id_colaboradora + "/3");
  }
});
router.post("/favoritos", function (req, res) {
  var dadosForm = {
    cod_fav: uuidv4(),
    id_colaboradora: req.body.id_colaboradora,
    id_usuario: req.session.usu_autenticado_id,
  };
  dbConnection.query(
    "SELECT * FROM favoritos WHERE id_colaboradora = ? AND id_usuario = ?",
    [dadosForm.id_colaboradora, dadosForm.id_usuario],
    function (error, results, fields) {
      if (error) throw error;
      if (results[0] === undefined) {
        dbConnection.query(
          "INSERT INTO favoritos SET ?",
          dadosForm,
          function (error, results, fields) {
            if (error) throw error;
            res.redirect("back");
          }
        );
      } else {
        dbConnection.query(
          "DELETE FROM favoritos WHERE id_colaboradora = ? AND id_usuario = ?",
          [dadosForm.id_colaboradora, dadosForm.id_usuario],
          function (error, results, fields) {
            if (error) throw error;
            res.redirect("back");
          }
        );
      }
    }
  );
});

module.exports = router;
