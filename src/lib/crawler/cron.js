const
	config = require('../../config/config')(),
	guardar = require('./guardar'),
	crawler = require('./crawler');
	mongoClient = require('mongodb').MongoClient;

const CronJob = require('cron').CronJob;
const job = new CronJob('0 * * * * *', function() {
		obtenerEnlacesSitios();
		console.log('Esta corriendo el Cron Job')
	}, function() {
		console.log('Se detuvo el Job');
	},
	true,
	'America/La_Paz'
);

function obtenerEnlacesSitios() {
	const
    url = `${config.db.dialect}://${config.db.host}:${config.db.port}/${config.db.database}`;
	mongoClient.connect(url)
  .then(db => {
		const sitio = db.collection('sitio');
		const enlace = db.collection('enlaces');
		return sitio.find().toArray()
		.then(pSitios => {
			if(!pSitios) throw new Error('No hay sitio');
			return Procesar(db, pSitios, enlace);
		})
		.then(() => {
			console.log('Cerrando la conexion a la base de datos');
			db.close();
		});
  })
  .catch(error => {
    console.log("Error en la conexion", error);
  });
}

function Procesar(pDB, pSitios, pModelo){
	console.log("Iniciando el proceso de los sitios");
  const promesas = pSitios.map(pItem => {
		return crawler.obtener(pItem)
		.then(pHtml => {
			console.log('=============imprimir pHtml');
			//console.log(pHtml);
			guardar.guardar(pModelo,pHtml).then(() => {
				return Promise.resolve(pHtml);
			});
		})
		.catch(pError => {
			return Promise.reject(pError);
		});
  });
  return Promise.all(promesas)
  .then(p => {
    Promise.resolve(p);
  })
  .catch(e => {
    console.log("Error en la ejecucion de promesas");
    Promise.reject(e);
  });
  return new Promise((resolve, reject) => {
  });
}
