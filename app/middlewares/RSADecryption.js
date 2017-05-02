var cryptico = require('cryptico');
var rsa_pr = cryptico.generateRSAKey(process.env.RSA_PASSWORD, 1024);
var rsa_pu = cryptico.publicKeyString(rsa_pr);

module.exports = function(req, res, next) {
    if (req.body.body) {
        req.body = req.body.body;

        try {
            var body = req.body;
            var decrypted = cryptico.decrypt(body, rsa_pr);
            req.body = JSON.parse(decrypted.plaintext);
            next();
        } catch (error) {
            res.status(400).json({
               status:'failed',
               message: 'The request body is not in the right format.'
            });
        }
    }
    else {
        res.status(400).json({
           status:'failed',
           message: 'The request body is not in the right format.'
        });
    }
};
