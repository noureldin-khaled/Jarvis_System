
module.exports.play = function(req, res, next) {
    console.log("here");
    req.checkBody('name', 'required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    var net = require('net');
    var http = require('http');
    var client = new net.Socket();

    var request = require("request");

    request("https://edison-gateway.firebaseio.com/DNS/edisonIP.json", function(error, response, body) {
        body = JSON.parse(body);
        var credentials = { "username":"hazem", "password":"hazem"};
            client.connect(1337, body.myIP, function() {
                console.log('Connected');
                client.write(JSON.stringify(credentials));
            });

            client.on('data', function(data) {
                if(data == "successfully logged in"){
                    client.write("play song-name");
                    res.status(200).json({
                        status: 'succeeded',
                        code: result
                    });
                }
                else{
                    res.status(500).json({
                        status: 'failed',
                        message: 'Internal server error'
                    });
                }
            });

            client.on('close', function() {
                console.log('Connection closed');
                res.status(500).json({
                    status: 'failed',
                    message: 'Connection closed'
                });
            });
    });

  };  




