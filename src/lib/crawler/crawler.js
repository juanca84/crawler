const
  Client = require('node-rest-client').Client,
  cliente = new Client(),
  cheerio = require('cheerio'),
  axios = require('axios'),
  iconv = require('iconv-lite');

function obtener(pItem){
  console.log("Peticion a ====>>>>> ", pItem.url);
  return new Promise((resolve, reject) => {
    console.log("Iniciando la promesa de peticion para La Razón.");
    cliente.get(pItem.url, (body, response) => {
      console.log('*----------Se va ejecutar ----------');
      body = iconv.decode(body, 'ISO-8859-1');
      const
        $ = cheerio.load(body),
        tabla = cheerio.load($('body').toString());
      let enlace = '';
      let fecha;

      const enlaces = [];
      tabla('a').each((k, elem) => {
        if(elem.type == 'tag'){
          const t = cheerio.load(elem);
          enlace = t('a').attr('href');
          enlaces.push({
            dominio: pItem.url,
            url: convertirEnlaceAbsoluto(pItem.url, enlace),
            fecha: new Date()});
        }
      });
      console.log(enlaces.length);
      return resolve([...new Set(enlaces)]);
    });
  });
}

function enlaceAbsoluto(url){
  const expr = /^http/;
  return expr.test(url);
}

function convertirEnlaceAbsoluto(pDominio, url){
  if(enlaceAbsoluto(url)){
    nuevaUrl = url;
  }
  else{
    nuevaUrl = pDominio + url;
  }
  return nuevaUrl;
}

module.exports = {
  obtener
};
