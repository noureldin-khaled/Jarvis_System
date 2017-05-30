var User = require('../models/User').User;
var Device = require('../models/Device').Device;

module.exports.index = function(req, res, next) {
    User.findAll({ where: { id: { $ne: req.user.id } } }).then(function(users) {
        users.sort(function(a, b) {
            return a.isAdmin() ? -1 : 1;
        });

        var results = [];
        for (var i = 0; i < users.length; i++) {
            var user = {
                id: users[i].id,
                username: users[i].username,
                type: users[i].type
            };

            results.push(user);
        }

        res.statusCode = 200;
        res.key = req.user.aes_public_key;
        res.response = {
            status: 'succeeded',
            users: results
        };

        next();
    }).catch(function(err) {
        res.status(500).json({
            status:'failed',
            message: 'Internal server error'
        });
    });
};

module.exports.indexForDevice = function(req, res, next) {
    req.checkParams('id', 'invalid').isInt();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    User.findAll({ include: [ { model: Device } ] }).then(function(users) {
        var results = [];

        for (var i = 0; i < users.length; i++) {
            var currentUser = users[i];
            var found = false;
            for (var j = 0; j < currentUser.devices.length && found === false; j++) {
                var currentDevice = currentUser.devices[j];
                if (currentDevice.id == req.params.id) {
                    found = true;
                }
            }

            if (found === false) {
                if (currentUser.id == req.user.id) {
                    res.status(403).json({
                        status: 'failed',
                        users: 'Authentication error, please log in again.'
                    });

                    return;
                }

                results.push({
                    id: currentUser.id,
                    username: currentUser.username,
                    type: currentUser.type
                });
            }
        }

        res.statusCode = 200;
        res.key = req.user.aes_public_key;
        res.response = {
            status: 'succeeded',
            users: results
        };
        next();
    }).catch(function(err) {
        res.status(500).json({
            status:'failed',
            message: 'Internal server error'
        });
    });
};

module.exports.update = function(req, res, next) {
    req.checkBody('old_password', 'required').notEmpty();

    var obj = {};
    if (req.body.new_password) {
        obj.password = req.body.new_password;
    }

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    if (!req.user.validPassword(req.body.old_password)) {
        res.status(403).json({
            status: 'failed',
            message: 'The provided credentials are not correct'
        });

        return;
    }

    User.update(obj, { where : { id : req.user.id } }).then(function(affected) {
        if (affected[0] === 1) {
            res.statusCode = 200;
            res.key = req.user.aes_public_key;
            res.response = {
                status: 'succeeded',
                message: 'user successfully updated'
            };
            next();
        }
        else {
            res.status(404).json({
                status:'failed',
                message: 'The requested route was not found.'
            });
        }
    }).catch(function(err) {
        res.status(500).json({
            status:'failed',
            message: 'Internal server error'
        });
    });
};

module.exports.updateAuth = function(req, res, next) {
    req.checkParams('id', 'invalid').isInt();

    var obj = {};
    if (req.body.type) {
        req.sanitizeBody('type').escape();
        req.sanitizeBody('type').trim();
        obj.type = req.body.type;
    }

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    User.update(obj, { where : { id : req.params.id } }).then(function(affected) {
        if (affected[0] === 1) {
            res.statusCode = 200;
            res.key = req.user.aes_public_key;
            res.response = {
                status: 'succeeded',
                message: 'user successfully updated'
            };
            next();
        }
        else {
            res.status(404).json({
                status:'failed',
                message: 'The requested route was not found.'
            });
        }
    }).catch(function(err) {
        res.status(500).json({
            status:'failed',
            message: 'Internal server error'
        });
    });
};

module.exports.privilege = function(req, res, next) {
    req.checkParams('user_id', 'invalid').isInt();
    req.checkParams('device_id', 'invalid').isInt();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    User.findById(req.params.user_id).then(function(user) {
        if (user) {
            Device.findById(req.params.device_id).then(function(device) {
                if (device) {
                    user.addDevice(device);
                    res.statusCode = 200;
                    res.key = req.user.aes_public_key;
                    res.response = {
                        status: 'succeeded'
                    };
                    next();
                }
                else {
                    res.status(404).json({
                        status: "failed",
                        message: "The requested route was not found."
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
            res.status(404).json({
                status: "failed",
                message: "The requested route was not found."
            });
        }

    }).catch(function(err) {
        res.status(500).json({
            status:'failed',
            message: 'Internal server error'
        });
    });
};
