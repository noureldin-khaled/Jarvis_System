module.exports = function(app) {
	var UserController = require('../controllers/UserController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');

	app.get('/api/user', auth, admin, UserController.index);
	app.get('/api/user/:id', auth, admin, UserController.indexForDevice);
	app.put('/api/user/:id', auth, admin, UserController.updateAuth);
	app.put('/api/user', auth, UserController.update);
	app.post('/api/user/:user_id/:device_id', auth, admin, UserController.privilege);
};
