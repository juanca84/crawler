const
  logger = require("../lib/logger.js");

console.log("configuracion de Producción activada");

module.exports = {
  db:{
    database: "[miDB]",
    username: "[miUsuario]",
    password: "[miSuperPassword]",
    dialect: "mongodb",
    port: 27017,
    host: "localhost",
  },
  jwtSecret: "[miSuperClave]",
  jwtSession: { session: false },
  puerto: 8001
}
