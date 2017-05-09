module.exports = function(app) {
  var CountryController = require('../controllers/CountryController');
  var auth = require('../middlewares/AuthMiddleware');
  var aes_encrypt = require('../middlewares/AESEncryption');
  var aes_decrypt = require('../middlewares/AESDecryption');
  var nonce = require('../middlewares/NonceMiddleware');

  app.post('/api/country',auth, aes_decrypt, nonce, CountryController.cityConverter, aes_encrypt);
};
