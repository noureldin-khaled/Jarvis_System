module.exports = function(app) {
	var RoomController = require('../controllers/RoomController');
	 var auth = require('../middlewares/AuthMiddleware');

	 app.post('/api/room/store',auth,RoomController.store);
	 app.post('/api/room/update/:id',auth,RoomController.update);
	 app.post('/api/room/delete/:id',auth,RoomController.delete);
	 app.get('/api/room',auth,RoomController.index);
};
