module.exports = function(app) {
	var RoomController = require('../controllers/RoomController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');
	var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');

	app.post('/api/room', auth, admin, aes_decrypt, RoomController.store, aes_encrypt);
	app.put('/api/room/:id', auth, admin, aes_decrypt, RoomController.update, aes_encrypt);
	app.delete('/api/room/:id', auth, admin, RoomController.delete, aes_encrypt);
	app.get('/api/room', auth, RoomController.index, aes_encrypt);
};
