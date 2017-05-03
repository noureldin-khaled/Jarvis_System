require('dotenv').load();

var http = require('http');
var fs = require('fs');
var express = require('express');
var expressValidator = require('express-validator');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var db = require('./config/database/database');
var dgram = require("dgram");

db.init(function(err) {
    if (err) {
        console.log('Unable to connect to MySQL Server', err);
        process.exit(1);
    }
    else {
        console.log('Connected successfully to MySQL.');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(expressValidator());

        app.use(methodOverride());
        require('./app/routes/routes.js')(app);

        var port = process.env.PORT || 80;

        http.createServer(app).listen(port, function() {
            console.log('HTTP Listening on port ' + port + '...');
        });

        listenForBroadcast(port);
    }
});

var listenForBroadcast = function(port) {
    var dgram = require("dgram");
    var server = dgram.createSocket("udp4");


    server.on("message", function (msg, rinfo) {
        var ip = require("ip").address();
        var message = new Buffer(ip + '::' + port);
        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, rinfo.port, rinfo.address, function(err, bytes) {
            if (err) throw err;
            console.log('Sent IP::PORT to ' + rinfo.address +':'+ rinfo.port);
            client.close();
        });
    });

    server.on("listening", function () {
        var address = server.address();
        console.log("Broadcast Listening => " + address.address + ":" + address.port + '...');
    });

    server.bind(9000);
};
// var crypto = require('crypto');
// var aesjs = require('aes-js');
// var ecdh = crypto.createECDH('secp256k1');
// // var server_pr = new Buffer.from(JSON.parse(process.env.AES_PR));
// // ecdh.setPrivateKey(server_pr);
// var sharedKey = {"type":"Buffer","data":[201,26,214,142,3,183,67,59,180,48,148,233,201,38,134,9,58,209,131,185,62,9,114,2,117,117,196,85,201,26,38,190]};
// var aesCtr = new aesjs.ModeOfOperation.ctr(new Buffer.from(sharedKey));
// var body = { password: "1234" };
// var bodyBytes = aesjs.utils.utf8.toBytes(body);
// var encryptedBytes = aesCtr.encrypt(bodyBytes);
// console.log(JSON.stringify(encryptedBytes));
// var s = JSON.stringify(encryptedBytes);
// // var s = "{\"0\":239,\"1\":93,\"2\":60,\"3\":177,\"4\":195,\"5\":137,\"6\":160,\"7\":83,\"8\":220,\"9\":17,\"10\":95,\"11\":163,\"12\":202,\"13\":212,\"14\":25}";
// console.log(JSON.parse(s));

// var https = require('https');
// https.get('https://mighty-savannah-17728.herokuapp.com/AesDecrypt/{"type":"Buffer","data":[201,26,214,142,3,183,67,59,180,48,148,233,201,38,134,9,58,209,131,185,62,9,114,2,117,117,196,85,201,26,38,190]}/{"0":207,"1":18,"2":124,"3":171,"4":199,"5":153,"6":167,"7":4,"8":252,"9":1,"10":81,"11":228,"12":147,"13":128,"14":102,"15":212,"16":228,"17":99,"18":120,"19":219,"20":31,"21":37}', function(res) {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);
//
//   res.on('data', function(d) {
//     console.log(JSON.parse(d));
//   });
//
// }).on('error', function(e) {
//   console.error(e);
// });
// var cryptico = require('cryptico');
// var rsa_pr = cryptico.generateRSAKey(process.env.RSA_PASSWORD, 1024);
// var rsa_pu = cryptico.publicKeyString(rsa_pr);
// console.log(rsa_pu);

// var crypto = require('crypto');
// var aesjs = require('aes-js');
// var ecdh = crypto.createECDH('secp256k1');
// var s = {
//     "s": "s"
// };
// console.log(s);
// var server_pr = new Buffer.from(JSON.parse(process.env.AES_PR));
// console.log(process.env.AES_PR);
// ecdh.setPrivateKey(server_pr);
// var client_pu = {"type":"Buffer","data":[2,1,128,25,243,245,227,148,149,65,147,65,178,250,154,159,18,170,128,33,207,239,52,160,130,13,233,206,151,91,139,81,131]};
// var sharedKey = ecdh.computeSecret(new Buffer.from(client_pu));
// console.log(JSON.stringify(sharedKey));

// var cryptico = require('cryptico');
// var rsa_pr = cryptico.generateRSAKey(process.env.RSA_PASSWORD, 1024);
// var rsa_pu = cryptico.publicKeyString(rsa_pr);
//
// var s = {
//     password: "1234"
// };
//
// var enc = cryptico.encrypt(JSON.stringify(s), rsa_pu);
// console.log(enc.cipher);

// var clinet_pu = "";
// var server_pr = process.env.AES_PR;
//
// var shared = saasdd;
//
// var crypto = require('crypto');
// var ecdh = crypto.createECDH('secp256k1');
// ecdh.generateKeys();
// var publicKey  = ecdh.getPublicKey(null,'compressed');
// var privateKey = ecdh.getPrivateKey(null, 'compressed');
// var sharedKey = ecdh.computeSecret(clientPublicKey); // bya5od el client PU
//
// var aesjs = require('aes-js');
// var text = '  Hello from the server side, this is a plain text  ';
// var textBytes = aesjs.utils.utf8.toBytes(text);
// var aesCtr = new aesjs.ModeOfOperation.ctr(sharedKey);
// var encryptedBytes = aesCtr.encrypt(textBytes);
//
//
//
//
// var decryptedBytes = aesCtr.decrypt(encryptedBytes);
// var decrypted = aesjs.utils.utf8.fromBytes(decryptedBytes);
// console.log(decrypted);
//
// var crypto = require('crypto');
// var ecdh = crypto.createECDH('secp256k1');
// var serverkey = new Buffer.from(JSON.parse(process.env.AES_PR));
// ecdh.setPrivateKey(serverkey);
// var client_pu = {"type":"Buffer","data":[2,141,252,212,2,110,64,148,47,58,121,138,97,49,26,58,166,136,128,231,39,33,18,131,253,189,8,219,186,128,84,213,220]};
// var sharedKey = ecdh.computeSecret(new Buffer.from(client_pu));
// console.log(sharedKey);
//
// var client_pr = {"type":"Buffer","data":[3,119,96,133,122,86,205,232,48,128,31,238,94,96,39,107,82,193,127,27,101,39,174,233,24,102,77,191,208,154,102,29]};
// ecdh.setPrivateKey(new Buffer.from(client_pr));
// var server_pu = new Buffer.from(JSON.parse(process.env.AES_PU));
// sharedKey = ecdh.computeSecret(new Buffer.from(server_pu));
// console.log(sharedKey);
