module.exports = function(app) {
   var AuthController = require('../controllers/AuthController');
   var auth = require('../middlewares/AuthMiddleware');
   var rsa_decrypt = require('../middlewares/RSADecryption');
   var aes_encrypt = require('../middlewares/AESEncryption');
   var login_decrypt = require('../middlewares/LoginDecryption');

   app.post('/api/login', login_decrypt, AuthController.login, aes_encrypt);
   app.post('/api/exchange', AuthController.exchange);
   app.post('/api/register', rsa_decrypt, AuthController.register);
   app.get('/api/salt/:username', AuthController.salt, aes_encrypt);
   app.get('/api/logout', auth, AuthController.logout, aes_encrypt);
};
