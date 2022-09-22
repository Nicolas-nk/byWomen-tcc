const express = require("express");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
var dbConnection = require("../../config/database");
const { v4: uuidv4 } = require("uuid");

const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/cadastre-se",

  body("nome").isLength({ min: 5, max: 100 }),
  body("tel").isLength({ min: 5, max: 20 }),
  body("email").isLength({ min: 5, max: 100 }),
  body("senha").isLength({ min: 4, max: 255 }),

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      // return res.render("pages/html", { erros: errors, dados: req.body });
      return res.json(errors);
    }

    var dadosForm = {
      id_usuario: uuidv4(),
      nome: req.body.nome,
      num_tel: req.body.tel,
      email: req.body.email,
      senha: bcrypt.hashSync(req.body.senha, salt),
    };

    dbConnection.query(
      "INSERT INTO usuario SET ?",
      dadosForm,
      function (error, results, fields) {
        if (error) throw error;
        // Neat!
        res.redirect("/login");
      }
    );
  }
);

router.post(
  "/login",

  function (req, res) {
    var dadosForm = {
      login: req.body.email,
      senha: req.body.senha,
      keepSession: req.body.keepSession,
    };

    dbConnection.query(
      "SELECT * FROM usuario WHERE nome = ? or email = ?",
      [dadosForm.login, dadosForm.login],
      function (error, results, fields) {
        if (error) throw error;
        var total = Object.keys(results).length;

        if (total == 1) {
          if (bcrypt.compareSync(dadosForm.senha, results[0].senha)) {
            req.session.autenticado = true;
            req.session.usu_autenticado_id = results[0].id_usuario;
            req.session.usu_autenticado_cpf = results[0].cpf_usuario;
            req.session.usu_autenticado_nome = results[0].nome;
            req.session.usu_autenticado_email = results[0].email;
            req.session.usu_autenticado_tel = results[0].num_tel;
            req.session.usu_autenticado_cep = results[0].cep;
            req.session.usu_autenticado_foto = results[0].foto_perfil;
          }
        }

        res.redirect("/");
      }
    );
  }
);

router.post(
  "/configuracao",

  function (req, res) {
    var dadosForm = {
      id_usuario: req.session.usu_autenticado_id,
      nome: req.body.nome,
      tel: req.body.tel,
      email: req.body.email,
      cep: req.body.cep,
      /* senha: bcrypt.hashSync(req.body.senha, salt), */
    };

    dbConnection.query(
      "UPDATE usuario SET nome = ?, email = ?, num_tel = ?, cep = ? WHERE id_usuario = ?",
      [
        dadosForm.nome,
        dadosForm.email,
        dadosForm.tel,
        dadosForm.cep,
        dadosForm.id_usuario,
      ],
      function (error, results, fields) {
        if (error) throw error;
      }
    );
    
    dbConnection.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [req.session.usu_autenticado_id],
      function (error, results, fields) {
        if (error) throw error;

        req.session.usu_autenticado_nome = results[0].nome;
        req.session.usu_autenticado_email = results[0].email;
        req.session.usu_autenticado_tel = results[0].num_tel;
        req.session.usu_autenticado_cep = results[0].cep;
        req.session.usu_autenticado_foto = results[0].foto_perfil;

        res.redirect("/perfil");
      }
    );
  }
);

module.exports = router;
