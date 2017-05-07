module.exports = function(app) {
	var UserController = require('../controllers/UserController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');
	var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');
	var nonce = require('../middlewares/NonceMiddleware');

	app.post('/api/user', auth, admin, aes_decrypt, nonce, UserController.index, aes_encrypt);
	app.post('/api/user/:id', auth, admin, aes_decrypt, nonce, UserController.indexForDevice, aes_encrypt);
	app.put('/api/user/:id', auth, admin, aes_decrypt, nonce, UserController.updateAuth, aes_encrypt);
	app.put('/api/user', auth, aes_decrypt, nonce, UserController.update, aes_encrypt);
	app.post('/api/user/:user_id/:device_id', auth, admin, aes_decrypt, nonce, UserController.privilege, aes_encrypt);
};
