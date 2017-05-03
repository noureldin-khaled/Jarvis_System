module.exports = function(app) {
	var UserController = require('../controllers/UserController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');
	var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');

	app.get('/api/user', auth, admin, UserController.index, aes_encrypt);
	app.get('/api/user/:id', auth, admin, UserController.indexForDevice, aes_encrypt);
	app.put('/api/user/:id', auth, admin, aes_decrypt, UserController.updateAuth, aes_encrypt);
	app.put('/api/user', auth, aes_decrypt, UserController.update, aes_encrypt);
	app.post('/api/user/:user_id/:device_id', auth, admin, UserController.privilege, aes_encrypt);
};
