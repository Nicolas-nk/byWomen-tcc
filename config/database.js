const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config({ path: '../.env'})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,

});

db.connect( (error) => {
    if (error) {
        console.log('Falha ao conectar com o banco de dados')
    }else{
        console.log("Conectado ao banco de dados")
    }
})