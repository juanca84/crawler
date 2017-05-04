function guardar(pModel, pVector){
  console.log("Iniciando el guardado multiple");
  return new Promise((resolve, reject) => {
    pVector.map(pItem => {
      pModel.find({url: pItem.url})
            .toArray()
            .then(items => {
              if(items.length ==  0){
                pModel.insert([pItem])
                      .then(r => resolve(r))
                      .catch(e => reject(e));
              }
              // else{
              //   console.log('Ya existe la url dentro dela BD.');
              // }
            });
    });
  });
}

module.exports = {
  guardar
};
