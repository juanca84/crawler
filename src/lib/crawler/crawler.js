const
  Client = require('node-rest-client').Client,
  cliente = new Client(),
  guardar = require('./guardar'),
  cheerio = require('cheerio'),
  url = require('url'),
  iconv = require('iconv-lite');

function procesarURL(pUrl, host, pDB, pModelo, nivel){
  return new Promise((resolve, reject) => {
    obtenerUrls(pUrl, host).then(respuesta => {
      const enlacesGuardar = [];
      respuesta.map((elemUrl, k) => {
        if(urlValida(elemUrl, host)){
          enlacesGuardar.push({
            dominio: host,
            padre: pUrl,
            url: convertirEnlaceAbsoluto(host, elemUrl),
            nivel,
            fecha: new Date(),
          });
        }
      });
      console.log(enlacesGuardar);
      guardar.guardar(pModelo, enlacesGuardar)
             .then(respuesta => {
                if(respuesta && respuesta.length > 0){
                  console.log()
                  respuesta.map((elem, k) => {
                    procesarURL(elem, host, pDB, pModelo, nivel + 1);
                  });
                }
                else{
                  console.log('se acabo la iteración!!!');
                  return true;
                }
            })
            .catch(error => {
              console.log("Error en la conexion", error);
            });
    });
  });
}

function obtenerUrls(pUrl, pHost){
  return new Promise((resolve, reject) => {
    if(pUrl){
      cliente.get(pUrl, (body, response) => {
        body = iconv.decode(body, 'ISO-8859-1');
        const
          $ = cheerio.load(body),
          tabla = cheerio.load($('body').toString());
        const enlacesArray = [];
        tabla('a').each((k, elem) => {
          if(elem.type == 'tag'){
            const t = cheerio.load(elem);
            enlacesArray.push(t('a').attr('href'));
          }
        });
        return resolve([...new Set(enlacesArray)]);
      });
    }
  });
}

function enlaceAbsoluto(pUrl){
  const expr = /^http/;
  return expr.test(pUrl);
}

function urlValida(pUrl, pHost){
  return true;
}

function convertirEnlaceAbsoluto(pDominio, pUrl){
  if(enlaceAbsoluto(pUrl)){
    nuevaUrl = pUrl;
  }
  else{
    nuevaUrl = url.resolve(pDominio, pUrl);
  }
  return nuevaUrl;
}

module.exports = {
  procesarURL
};
