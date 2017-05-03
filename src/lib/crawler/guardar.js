function guardar(pModel, pVector){
  console.log("Iniciando el guardado multiple");
  return new Promise((resolve, reject) => {
    pModel.insert(pVector)
    .then(r => resolve(r))
    .catch(e => reject(e));
  });
}

module.exports = {
  guardar
};
