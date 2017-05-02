var crypto = require('crypto');
var aesjs = require('aes-js');
var ecdh = crypto.createECDH('secp256k1');
var server_pr = new Buffer.from(JSON.parse(process.env.AES_PR));
ecdh.setPrivateKey(server_pr);

module.exports = function(req, res, next) {
    try {
        var sharedKey = ecdh.computeSecret(new Buffer.from(JSON.parse(res.key)));
        var aesCtr = new aesjs.ModeOfOperation.ctr(sharedKey);
        var body = JSON.stringify(res.response);
        var bodyBytes = aesjs.utils.utf8.toBytes(body);
        var encryptedBytes = aesCtr.encrypt(bodyBytes);

        res.status(res.statusCode).json({
            body: encryptedBytes
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: 'The key is incorrect.'
        });
    }
};
