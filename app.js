const express = require('express');
var session = require("express-session");

const app = express();
const port = 3000;

app.use(express.static('app/public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
  }));

app.set('view engine', 'ejs');
app.set('views', './app/views');

var rotas = require('./app/routes/router');
app.use('/', rotas);
app.use('/auth', require('./app/routes/auth'));

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta: ${port}`);
});
