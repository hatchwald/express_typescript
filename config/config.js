require("dotenv").config()
module.exports = {
    development: {
        dialect: "mysql",
        host: process.env.HOST,
        username: process.env.USERDB,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT
    }
};