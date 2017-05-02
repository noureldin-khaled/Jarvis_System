var User = require('../models/User').User;
var jwt  = require('jsonwebtoken');

module.exports.login = function(req, res, next) {
    console.log(req.body);
    
    // req.checkBody('username', 'required').notEmpty();
    // req.sanitizeBody('username').escape();
    // req.sanitizeBody('username').trim();
    //
    // req.checkBody('password', 'required').notEmpty();
    //
    // var errors = req.validationErrors();
    //
    // if (errors) {
    //     res.status(400).json({
    //         status: 'failed',
    //         errors: errors
    //     });
    //
    //     return;
    // }
    //
    // User.findOne({ where : { username: req.body.username } }).then(function(user) {
    //     if (!user) {
    //         res.status(401).json({
    //             status: 'failed',
    //             message: 'Either the Username or Password is incorrect.'
    //         });
    //
    //         return;
    //     }
    //
    //     if (user.validPassword(req.body.password)) {
    //         var generateToken = function() {
    //             var payload = { userId: user.id };
    //             var token = jwt.sign(payload, process.env.JWTSECRET);
    //
    //             user.token = token;
    //             user.save().then(function(usr) {
    //                 res.status(200).json({
    //                     status: 'succeeded',
    //                     user: {
    //                         id: usr.id,
    //                         username: usr.username,
    //                         type: usr.type,
    //                         token: usr.token
    //                     }
    //                 });
    //
    //             }).catch(function(err) {
    //                 res.status(500).json({
    //                     status: 'failed',
    //                     message: 'Internal server error',
    //                     error: err
    //                 });
    //             });
    //         };
    //
    //         if (user.token) {
    //             try
    //             {
    //                 jwt.verify(user.token, process.env.JWTSECRET);
    //
    //                 res.status(200).json({
    //                     status: 'succeeded',
    //                     user: {
    //                         id: user.id,
    //                         username: user.username,
    //                         type: user.type,
    //                         token: user.token
    //                     }
    //                 });
    //             }
    //             catch(err)
    //             {
    //                 generateToken();
    //             }
    //         }
    //         else {
    //             generateToken();
    //         }
    //     }
    //     else {
    //         res.status(401).json({
    //             status: 'failed',
    //             message: 'Either the Username or Password is incorrect.'
    //         });
    //     }
    //
    // }).catch(function(err) {
    //     res.status(500).json({
    //         status: 'failed',
    //         message: 'Internal server error',
    //         error: err
    //     });
    // });
};

module.exports.exchange = function(req, res, next) {
    req.checkBody('username', 'required').notEmpty();
    req.sanitizeBody('username').escape();
    req.sanitizeBody('username').trim();

    req.checkBody('aes_public_key', 'required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    var user = User.build({
        username: req.body.username,
        aes_public_key: req.body.aes_public_key
    });

    User.findAll().then(function(entries) {
        if (entries.length === 0) {
            user.type = 'Admin';
        }
        else {
            user.type = 'Normal';
        }

        user.save().then(function(usr) {
            res.status(200).json({
                status: 'succeeded',
                aes_public_key: process.env.AES_PU,
                rsa_public_key: process.env.RSA_PU
            });
        }).catch(function(err) {
            if (err.message === 'Validation error') {
                var errors = [];
                for (var i = 0; i < err.errors.length; i++) {
                    var error = {
                        param: err.errors[i].path,
                        msg: err.errors[i].type
                    };

                    if (err.errors[i].value) {
                        error.value = err.errors[i].value;
                    }

                    errors.push(error);
                }

                res.status(400).json({
                    status: 'failed',
                    errors: errors
                });
            }
            else {
                res.status(500).json({
                    status: 'failed',
                    message: 'Internal server error',
                    error: err
                });
            }
        });
    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });
    });
};

module.exports.register = function(req, res, next) {
    req.checkBody('username', 'required').notEmpty();
    req.sanitizeBody('username').escape();
    req.sanitizeBody('username').trim();

    req.checkBody('password', 'required').notEmpty();
    req.checkBody('salt', 'required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    User.update({
        password: req.body.password,
        salt: req.body.salt
    }, {
        where: {
            username: req.body.username
        }
    }).then(function(affected) {
        if (affected[0] === 1) {
           res.status(200).json({
              status: 'succeeded'
           });
        }
        else {
           res.status(404).json({
              status: 'failed',
              message: 'Either the Username or Password is incorrect.'
           });
        }
    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });
    });

};

module.exports.salt = function(req, res, next) {
    req.checkParams('username', 'required').notEmpty();
    req.sanitizeBody('username').escape();
    req.sanitizeBody('username').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    User.findOne({ where : { username: req.params.username } }).then(function(user) {
        if (!user) {
            res.status(401).json({
                status: 'failed',
                message: 'Either the Username or Password is incorrect.'
            });

            return;
        }

        res.statusCode = 200;
        res.key = user.aes_public_key;
        res.response = {
            status: 'succeeded',
            salt: user.salt
        };
        // res.status(200).json({
        //     status: 'succeeded',
        //     salt: user.salt
        // });

        next();
    }).catch(function(err) {
        res.status = 500;
        res.response = {
            status: 'failed',
            message: 'Internal server error',
            error: err
        };
        // res.status(500).json({
        //     status: 'failed',
        //     message: 'Internal server error',
        //     error: err
        // });
    });
};

module.exports.logout = function(req, res, next) {
    req.user.nullifyToken(function() {
        req.user.save().then(function(user) {
            res.status(200).json({
                status: 'succeeded',
                message: 'user logged out.'
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error',
                error: err
            });
        });

    });
};
