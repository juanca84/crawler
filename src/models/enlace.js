
module.exports = app => {
  const db = app.get('db');
   return db.createCollection('enlaces', {
    validator: {
      $or: [
        { dominio: { $type: 'string'}},
        { padre: { $type: 'string'}},
        { url: { $type: 'string'}},
        { fecha: { $type: 'date'}},
        { nivel: { $type: 'integer'}},
      ],
    },
  });
};
