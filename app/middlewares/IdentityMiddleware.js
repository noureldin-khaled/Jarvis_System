var User = require('../models/User').User;
module.exports = function(req, res, next) {
    var username = req.headers.username;
    if (username) {
        User.findOne({ where : { username: username } }).then(function(user) {
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(404).json({
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
        res.status(401).json({
            status:'failed',
            message: 'Please attach the username in the headers.'
        });
    }
};
