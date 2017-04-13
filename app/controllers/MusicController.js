
module.exports.play = function(req, res, next) {

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


    http.get({
        host: 'edison-gateway.firebaseio.com',
        path: '/DNS/edisonIP.json'
    }, function(response) {
        
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            var parsed = JSON.parse(body);
            var credentials = { "username":"hazem", "password":"hazem"};

            client.connect(1337, parsed.myIP, function() {
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
            });
            
        });
    });

    // client.connect(1337, '192.168.0.103', function() {
    //     console.log('Connected');
    //     client.write("hazem+hazem");
    // });

    // client.on('data', function(data) {
    //     if(data == "successfully logged in"){
    //         client.write("play song-name")
    //     }
    // });

    // client.on('close', function() {
    //     console.log('Connection closed');
    // });

};

