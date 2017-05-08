module.exports = function(app){
	var Pattern = require('../controllers/PatternController');
	var auth = require('../middlewares/AuthMiddleware');

	app.get('/api/patterns',auth,Pattern.getPatterns);
	app.put('/api/patterns/:sequenceid/:eventid',auth,Pattern.update);
	app.put('/api/patterns',auth,Pattern.put);
	app.delete('/api/patterns/:sequenceid',auth,Pattern.delete);
	app.get('/api/graph',auth,Pattern.getGraph);
	Pattern.updateFrequency();

};
