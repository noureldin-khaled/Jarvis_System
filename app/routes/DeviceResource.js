module.exports = function(app) {

  var DeviceController = require('../controllers/DeviceController');
  var auth = require('../middlewares/AuthMiddleware');

  app.post('/device/store', auth, DeviceController.storeDevice);
  app.delete('/device/delete/:id', auth, DeviceController.deleteDevice);
  app.post('/device/update/:id', auth, DeviceController.updateDevice);

};
