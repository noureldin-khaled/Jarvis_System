module.exports = function(app) {

  var DeviceController = require('../controllers/DeviceController');
  var auth = require('../middlewares/AuthMiddleware');

  app.post('/device/store', auth, DeviceController.storeDevice);

};
