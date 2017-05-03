module.exports = function(app) {
    var DeviceController = require('../controllers/DeviceController');
    var auth = require('../middlewares/AuthMiddleware');
    var admin = require('../middlewares/AdminMiddleware');
    var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');

    app.post('/api/device', auth, admin, aes_decrypt, DeviceController.store, aes_encrypt);
    app.delete('/api/device/:id', auth, admin, DeviceController.delete, aes_encrypt);
    app.put('/api/device/:id', auth, admin, aes_decrypt, DeviceController.update, aes_encrypt);
    app.get('/api/device', auth, DeviceController.index, aes_encrypt);
    app.post('/api/device/:id', auth, aes_decrypt, DeviceController.handle, aes_encrypt);
    app.get('/api/device/scan', auth, DeviceController.scan, aes_encrypt);

    DeviceController.updateIPs();
};
