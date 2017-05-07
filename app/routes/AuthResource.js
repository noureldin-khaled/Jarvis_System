module.exports = function(app) {
   var AuthController = require('../controllers/AuthController');
   var auth = require('../middlewares/AuthMiddleware');
   var rsa_decrypt = require('../middlewares/RSADecryption');
   var aes_encrypt = require('../middlewares/AESEncryption');
   var aes_decrypt = require('../middlewares/AESDecryption');
   var identity = require('../middlewares/IdentityMiddleware');
   var nonce = require('../middlewares/NonceMiddleware');

   app.post('/api/login', identity, aes_decrypt, nonce, AuthController.login, aes_encrypt);
   app.post('/api/exchange', identity, nonce, AuthController.exchange);
   app.post('/api/register', rsa_decrypt, AuthController.register);
   app.post('/api/salt/:username', identity, aes_decrypt, nonce, AuthController.salt, aes_encrypt);
   app.post('/api/logout', auth, aes_decrypt, nonce, AuthController.logout, aes_encrypt);
};
