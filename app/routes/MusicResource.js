module.exports = function(app) {

  var MusicController = require('../controllers/MusicController');
  var auth = require('../middlewares/AuthMiddleware');

  app.post('/api/play', auth, MusicController.play);

};
