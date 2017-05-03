module.exports = app => {
  const util = require('../../lib/util');

  app.get('/api/v1/articulo', (req,res) => {
    const articulo = app.get('db').collection('articulo');

    articulo.find().toArray()
    .then(pDatos => {
      res.status(200).send(util.formatearMensaje('EXITO', 'Obtencion de datos exitoso', {total:pDatos.length,resultado:pDatos}));
    })
    .catch(pError => {
      console.log("Error al buscar y transformar", pError);
      res.status(412).send(util.formatearMensaje('ERROR', pError));
    });
  });


  app.post('/api/v1/articulo', (req,res) => {
    const articulo = app.get('db').collection('articulo');
    console.log(req.body);
    articulo.insert(req.body)
    .then(p => {
      console.log("Insercion correctamente", p);
      res.status(200).send(util.formatearMensaje('EXITO', 'Articulo registrado correctamente', p));
    })
    .catch(pError => {
      console.error("Error al insertar", pError);
      res.status(412).send(util.formatearMensaje('ERROR', pError));
    });
  });
};
