const express = require('express');
const db = require('./config/database');

const app = express();
const port = 3000;

app.use(express.static('app/public'));

app.set('view engine', 'ejs');
app.set('views', './app/views');

var rotas = require('./app/routes/router');
app.use('/', rotas);
app.use('/auth', require('./app/routes/auth'));

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta: ${port}`);
});
