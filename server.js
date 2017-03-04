require('dotenv').load();

var express = require('express');
var expressValidator = require('express-validator');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var db = require('./config/database/database');

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

      var port = process.env.PORT || 8000;

      app.listen(port, function() {
         console.log('Listening on port ' + port + '...');
      });
   }
});
