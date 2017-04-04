

module.exports = function(app) {
   var AuthController = require('../controllers/AuthController');
   var auth = require('../middlewares/AuthMiddleware');

   app.post('/api/login', AuthController.login);
   app.post('/api/register', AuthController.register);
   app.post('/api/auth', AuthController.auth);
   app.get('/api/logout', auth, AuthController.logout);

};
