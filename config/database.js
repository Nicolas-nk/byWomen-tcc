const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config({ path: './.env'})

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

db.getConnection( (error) => {
    if (error) {
        console.log(error)
    }else{
        console.log("Conectado ao banco de dados")
    }
})

module.exports = db