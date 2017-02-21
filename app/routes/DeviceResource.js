module.exports = function(app) {

  var DeviceController = require('../controllers/DeviceController');
  var auth = require('../middlewares/AuthMiddleware');
  var admin = require('../middlewares/AdminMiddleware');

  app.post('/api/device', auth, admin, DeviceController.store);
  app.delete('/api/device/:id', auth, admin, DeviceController.delete);
  app.put('/api/device/:id', auth, admin, DeviceController.update);
  app.get('/api/device', auth, DeviceController.index);
  app.post('/api/device/:id', auth, DeviceController.handle);
  app.get('/api/device/scan', auth, DeviceController.scan);

  DeviceController.updateIPs();
};
