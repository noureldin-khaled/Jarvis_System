module.exports = function(app) {

  var DeviceController = require('../controllers/DeviceController');
  var auth = require('../middlewares/AuthMiddleware');
  var admin = require('../middlewares/AdminMiddleware');

  app.post('/api/device/store', auth, admin, DeviceController.store);
  app.delete('/api/device/:id', auth, admin, DeviceController.delete);
  app.put('/api/device/:id', auth, admin, DeviceController.update);

};
