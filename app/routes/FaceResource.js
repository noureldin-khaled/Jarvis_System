module.exports = function(app) {
	var FaceController = require('../controllers/FaceController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');
	var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');
	var nonce = require('../middlewares/NonceMiddleware');

    app.post('/api/face/train', auth, admin, FaceController.Train);
};
