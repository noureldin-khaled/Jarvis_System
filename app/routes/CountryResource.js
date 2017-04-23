module.exports = function(app) {
  var CountryController = require('../controllers/CountryController');
  var auth = require('../middlewares/AuthMiddleware');

  app.post('/api/country',auth,CountryController.cityConverter);
};
