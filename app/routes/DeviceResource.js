module.exports = function(app) {

  var DeviceController = require('../controllers/DeviceController');
  var auth = require('../middlewares/AuthMiddleware');

  app.post('/api/device/store', auth, DeviceController.store);
  app.delete('/api/device/delete/:id', auth, DeviceController.delete);
  app.post('/api/device/update/:id', auth, DeviceController.update);

};
