module.exports = function(app) {
    var DeviceController = require('../controllers/DeviceController');
    var auth = require('../middlewares/AuthMiddleware');
    var admin = require('../middlewares/AdminMiddleware');
    var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');
    var nonce = require('../middlewares/NonceMiddleware');

    app.post('/api/device', auth, admin, aes_decrypt, nonce, DeviceController.store, aes_encrypt);
    app.post('/api/device/delete/:id', auth, admin, aes_decrypt, nonce, DeviceController.delete, aes_encrypt);
    app.put('/api/device/:id', auth, admin, aes_decrypt, nonce, DeviceController.update, aes_encrypt);
    app.post('/api/devices', auth, aes_decrypt, nonce, DeviceController.index, aes_encrypt);
    app.post('/api/device/handle/:id', auth, aes_decrypt, nonce, DeviceController.handle, aes_encrypt);
    app.post('/api/device/scan', auth, aes_decrypt, nonce, DeviceController.scan, aes_encrypt);

    DeviceController.updateIPs();
};
