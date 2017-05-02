var crypto = require('crypto');
var aesjs = require('aes-js');
var ecdh = crypto.createECDH('secp256k1');
var server_pr = new Buffer.from(JSON.parse(process.env.AES_PR));
ecdh.setPrivateKey(server_pr);

module.exports = function(req, res, next) {
    if (req.body.body) {
        req.body = req.body.body;

        try {
            var body = req.body;
            var sharedKey = ecdh.computeSecret(new Buffer.from(JSON.parse(res.key)));
            var aesCtr = new aesjs.ModeOfOperation.ctr(sharedKey);
            var decryptedBytes = aesCtr.decrypt(body);
            var decrypted = aesjs.utils.utf8.fromBytes(decryptedBytes);

            req.body = JSON.parse(decrypted);
            next();
        } catch (error) {
            console.log(error);
            res.status(400).json({
               status:'failed',
               message: 'The request body is not in the right format or the key is incorrect.'
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
