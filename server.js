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
