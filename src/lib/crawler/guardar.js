function guardar(pModel, pVector){
  console.log("Iniciando el guardado multiple");
  return new Promise((resolve, reject) => {
    let listaUrls = [];
    pVector.map(pItem => {
      pModel.find({url: pItem.url})
            .toArray()
            .then(items => {
              if(items.length ==  0){
                pModel.insert([pItem])
                      .then(r => resolve(r))
                      .catch(e => reject(e));
                listaUrls.push(pItem.url);
                return listaUrls;
              }
            })
            .then(resultado => {resolve(resultado)});
    });
  });
}

module.exports = {
  guardar
};
