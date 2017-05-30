module.exports = function(app) {
	var RoomController = require('../controllers/RoomController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');
	var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');
	var nonce = require('../middlewares/NonceMiddleware');

	app.post('/api/room', auth, admin, aes_decrypt, nonce, RoomController.store, aes_encrypt);
	app.put('/api/room/:id', auth, admin, aes_decrypt, nonce, RoomController.update, aes_encrypt);
	app.post('/api/room/:id', auth, admin, aes_decrypt, nonce, RoomController.delete, aes_encrypt);
	app.post('/api/rooms', auth, aes_decrypt, nonce, RoomController.index, aes_encrypt);
};
