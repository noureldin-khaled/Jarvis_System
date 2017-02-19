module.exports = function(app) {
	var RoomController = require('../controllers/RoomController');
	var auth = require('../middlewares/AuthMiddleware');
	var admin = require('../middlewares/AdminMiddleware');


	app.post('/api/room/store',auth, admin, RoomController.store);
	app.put('/api/room/:id',auth, admin, RoomController.update);
	app.delete('/api/room/:id',auth, admin, RoomController.delete);
	app.get('/api/room',auth,RoomController.index);
};
