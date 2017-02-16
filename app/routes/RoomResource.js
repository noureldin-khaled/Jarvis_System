module.exports = function(app) {
	var RoomController = require('../controllers/RoomController');
	 var auth = require('../middlewares/AuthMiddleware');

	 app.post('/api/addRoom',auth,RoomController.addRoom);
	 app.post('/api/editRoom/:id',auth,RoomController.editRoom);
	 app.post('/api/deleteRoom/:id',auth,RoomController.deleteRoom);
	 app.get('/api/getRooms',auth,RoomController.getRooms);
};
