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
    };

    var result = dbConnection.query(
      "SELECT * FROM usuario WHERE nome = ? or email = ?",
      [dadosForm.login, dadosForm.login],
      function (error, results, fields) {
        if (error) throw error;
        var total = Object.keys(results).length;
        
        if (total == 1) {
          if (bcrypt.compareSync(dadosForm.senha,results[0].senha)) {
            req.session.autenticado = true;
            req.session.usu_autenticado = results[0].nome;
          }
          
        }
        res.redirect("/");
      }
    );
  }
);

module.exports = router;
