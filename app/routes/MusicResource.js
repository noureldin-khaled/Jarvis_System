module.exports = function(app) {

  var MusicController = require('../controllers/MusicController');
  var auth = require('../middlewares/AuthMiddleware');
  var aes_encrypt = require('../middlewares/AESEncryption');
  var aes_decrypt = require('../middlewares/AESDecryption');
  var nonce = require('../middlewares/NonceMiddleware');

  app.post('/api/play', auth, aes_decrypt, nonce, MusicController.play, aes_encrypt);

};
