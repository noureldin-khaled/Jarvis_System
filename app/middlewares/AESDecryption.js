var crypto = require('crypto');
var aesjs = require('aes-js');
var ecdh = crypto.createECDH('secp256k1');
var server_pr = new Buffer.from(JSON.parse(process.env.AES_PR));
ecdh.setPrivateKey(server_pr);

module.exports = function(req, res, next) {
    if (req.body.body) {
        req.body = req.body.body;
        try {
            var body = JSON.parse(req.body);
            var client_pu = req.user.aes_public_key;
            var sharedKey = ecdh.computeSecret(new Buffer.from(JSON.parse(client_pu)));
            var aesCtr = new aesjs.ModeOfOperation.ctr(sharedKey);
            var arr = [];
            for(var p in Object.getOwnPropertyNames(body)) {
                arr[p] = body[p];
            }

            var decryptedBytes = aesCtr.decrypt(arr);
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
