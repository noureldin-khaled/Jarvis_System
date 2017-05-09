module.exports = function(app){
	var Pattern = require('../controllers/PatternController');
	var auth = require('../middlewares/AuthMiddleware');
	var aes_encrypt = require('../middlewares/AESEncryption');
	var aes_decrypt = require('../middlewares/AESDecryption');
	var nonce = require('../middlewares/NonceMiddleware');

	app.post('/api/patterns', auth, aes_decrypt, nonce, Pattern.getPatterns, aes_encrypt);
	app.put('/api/patterns/:sequenceid/:eventid', auth, aes_decrypt, nonce, Pattern.update, aes_encrypt);
	app.post('/api/patterns/:sequenceid', auth, aes_decrypt, nonce, Pattern.delete, aes_encrypt);
	app.put('/api/patterns',auth,Pattern.put);					// For testing
	app.get('/api/graph',auth,Pattern.getGraph);				// For testing
	Pattern.updateFrequency();
};
