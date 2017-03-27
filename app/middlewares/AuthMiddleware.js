module.exports = function(req, res, next) {
   var jwt = require('jsonwebtoken');
   var User = require('../models/User').User;

   var token = req.headers.authorization;
   var secret = process.env.JWTSECRET;

   try
   {
      jwt.verify(token, secret);

      User.findOne({ where : { token: token } }).then(function(user) {
          if (user) {
              req.user = user;
              next();
          }
          else {
              res.status(401).json({
                 status:'failed',
                 message: 'Authentication error, please log in again.'
              });
          }

      }).catch(function(err) {
         res.status(500).json({
            status:'failed',
            message: 'Internal server error'
         });
      });
   }
   catch(err)
   {
      res.status(401).json({
         status:'failed',
         message: 'Authentication error, please log in again.'
      });
   }
};
