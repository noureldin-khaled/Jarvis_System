module.exports = function(app){
	var Pattern = require('../controllers/PatternController');
	var auth = require('../middlewares/AuthMiddleware');

	app.get('/api/pattern',auth,Pattern.getPatterns);
	app.put('/api/pattern/:sequenceid/:eventid',auth,Pattern.update);

};