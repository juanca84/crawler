const
  http = require('http'),
  path = require("path");

console.log("archivo util");

const funcionCabeceras = (objs) => {
  const cabs = new Array();
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    for (const key in obj) {
      const attrName = key;
      const attrValue = obj[key];
      //Ocultamos el atributo URL, para no ser mostrado en la vista EJS
      if (attrName === "url" ) {
      } else {
        cabs.push(attrName);
      }
    }
  }
  return cabs;
};


/**
Funcion que asigna un formato a los mensajes de respuesta para una peticion http.
@param {estado} Estado de la peticion http.
@param {mensaje} Mensaje a retornar.
@param {datos} Datos obtenidos o generados para ser retornados.
@return Retorna un {json} con los datos en el formato establecido.
*/
const formatearMensaje = (tipoMensaje, mensaje, datos,token) => {

  // Validacion para el parametro mensaje.
  let mensajeFinal=mensaje;

  // Si el parametro mensaje es un objeto, actualiza el valor del mensaje final.
  if(mensaje.message) mensajeFinal=mensaje.message;

  if(process.env.NODE_ENV =='production'){
    // console.log("El entorno es produccion", mensaje);
    // console.log("El entorno es produccion", mensaje.name);
    // console.log("Revisando el mensaje final", mensajeFinal);
    if(mensaje.name ){
      if(mensaje.name !== 'Error'){
        mensajeFinal="Ha ocurrido un error al procesar su solicitud.";
      }
      else {
        console.log("El nombre del mensaje es ERROR", mensaje);
      }
    }
  }
  // Declara el objeto respuesta.
  var respuesta={
    tipoMensaje: tipoMensaje,
    mensaje: mensajeFinal,
    datos: datos
  };


  // Esto solo es necesario, en la operacion de autenticación.
  if(token)respuesta.token= token;


  return respuesta;
};

/**
 Funcion que ejecuta una promesa.
 @param {pConsulta} Texto Cadena que contiene la consulta a ejecutar.
 @return retorna una promesa.
 */
function  ejecutarConsulta(pConsulta, pgCliente){

  return new Promise((resolve,reject) => {
    // Instancia una consulta del tipo cliente.
    const query=pgCliente.query(pConsulta)

    // Durante la ejecucion de la consulta,
    query.on("row", (pFila,pResultado) => {
      pResultado.addRow(pFila);
    });

    query.on("end", pResultado => {

      if(pResultado.command == 'UPDATE')
        (pResultado.rowCount ==1)?resolve(true):resolve(false);
      else if(pResultado.command == 'INSERT'){
        (pResultado.rowCount ==1)?resolve(true):resolve(false);
      }
      else
        resolve(pResultado.rows);
    })
  });
}

module.exports = {
  funcionCabeceras,
  formatearMensaje,
  ejecutarConsulta
};
