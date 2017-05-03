
const
  fs = require("fs"),
  path = require("path"),
  consign = require('consign'),
  mongoClient = require('mongodb').MongoClient;

module.exports = app => {
  const
    c = app.src.config.config,
    url = `${c.db.dialect}://${c.db.host}:${c.db.port}/${c.db.database}`;
  if(!app.get('db')){
    mongoClient.connect(url)
    .then(db => {
      app.set('db', db);
      consign()
      .then("src/models")
      .into(app);
    })
    .catch(error => {
      console.log("Error en la conexion", error);
    });
  }
};
