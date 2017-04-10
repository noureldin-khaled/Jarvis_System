module.exports = function(app){
	var Pattern = require('../controllers/PatternController');
	var auth = require('../middlewares/AuthMiddleware');

	app.get('/api/patterns',auth,Pattern.getPatterns);
	app.put('/api/patterns/:sequenceid/:eventid',auth,Pattern.update);
	app.put('/api/patterns',auth,Pattern.put);
	Pattern.updateFrequency();

};
