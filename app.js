const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    cookie: { maxAge: 2629800000 },
    store: new MemoryStore({
      checkPeriod: 2629800000
    }),
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat'
}));

app.use(express.static('app/public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './app/views');

var rotas = require('./app/routes/router');
app.use('/', rotas);
app.use('/auth', require('./app/routes/auth'));

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta: ${port}`);
});
