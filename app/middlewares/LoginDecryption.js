var User = require('../models/User').User;
var crypto = require('crypto');
var aesjs = require('aes-js');
var ecdh = crypto.createECDH('secp256k1');
var server_pr = new Buffer.from(JSON.parse(process.env.AES_PR));
ecdh.setPrivateKey(server_pr);

module.exports = function(req, res, next) {
    if (req.body.body) {
        req.body = req.body.body;

        var username = req.headers.username;
        if (!username) {
            res.status(401).json({
               status:'failed',
               message: 'Please attach the username in the headers.'
            });

            return;
        }

        User.findOne({ where : { username: username } }).then(function(user) {
            if (user) {
                try {
                    var body = JSON.parse(req.body);
                    var client_pu = user.aes_public_key;
                    var sharedKey = ecdh.computeSecret(new Buffer.from(JSON.parse(client_pu)));
                    var aesCtr = new aesjs.ModeOfOperation.ctr(sharedKey);
                    var arr = [];
                    for(var p in Object.getOwnPropertyNames(body)) {
                        arr[p] = body[p];
                    }

                    var decryptedBytes = aesCtr.decrypt(arr);
                    var decrypted = aesjs.utils.utf8.fromBytes(decryptedBytes);

                    req.body = JSON.parse(decrypted);
                    req.body.username = username;
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
                res.status(401).json({
                   status:'failed',
                   message: 'Either the Username or Password is incorrect.'
                });
            }

        }).catch(function(err) {
           res.status(500).json({
              status:'failed',
              message: 'Internal server error'
           });
        });
    }
    else {
        res.status(400).json({
           status:'failed',
           message: 'The request body is not in the right format.'
        });
    }
};
