const wait = function(input, cb) {
  setTimeout(function() {
    console.log('Esperamos 3 segundos.');
    cb(null, input);
  }, 30000);
};

module.exports.wait = wait;
