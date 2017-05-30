var User = require('../models/User').User;
module.exports = function(req, res, next) {
    if (req.body.nonce) {
        if (req.body.nonce == req.user.nonce) {
            res.status(401).json({
                status:'failed',
                message: 'Access denied.'
            });
        }
        else {
            req.user.nonce = req.body.nonce;
            req.user.save().then(function(user) {
                next();
            }).catch(function(err) {
                res.status(500).json({
                    status: 'failed',
                    message: 'Internal server error',
                    error: err
                });
            });
        }
    }
    else {
        res.status(401).json({
            status:'failed',
            message: 'Access denied.'
        });
    }
};
