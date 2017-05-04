module.exports = function(app) {
   require('./AuthResource')(app);
   require('./DeviceResource')(app);
   require('./RoomResource')(app);
   require('./UserResource')(app);
   require('./PatternResource')(app);
   require('./CountryResource')(app);


   // app.get('/keys', function(req, res) {
   //  //    var crypto = require('crypto');
   //  //    var ecdh = crypto.createECDH('secp256k1');
   //  //    ecdh.generateKeys();
   //  //    var AESpublicKey  = ecdh.getPublicKey(null, 'compressed');
   //  //    var AESprivateKey = ecdh.getPrivateKey(null, 'compressed');
   //     //
   //  //    var cryptico = require('cryptico');
   //  //    var RSAprivateKey = cryptico.generateRSAKey("serverpassword",1024);
   //  //    var RSApublicKey = cryptico.publicKeyString(RSAprivateKey);
   //
   //     res.json({
   //         AES_PU: process.env.AES_PU,
   //         AES_PR: process.env.AES_PR,
   //         RSA_PU: process.env.RSA_PU,
   //         RSA_PR: process.env.RSA_PR
   //     });
   //  //    console.log("AES PU: " + AESpublicKey);
   //  //    console.log("AES PR: " + AESprivateKey);
   //  //    console.log("RSA PU: " + RSApublicKey);
   //  //    console.log("RSA PR: " + RSAprivateKey);
   // });

   app.use(function(req, res, next) {
      res.status(404).json({
         status:'failed',
         message: 'The requested route was not found.'
      });
   });
};
