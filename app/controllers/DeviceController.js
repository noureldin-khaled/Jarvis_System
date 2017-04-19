var Device = require('../models/Device').Device;
var Script = require('../script');
var Patterns = require('./PatternController');

module.exports.store = function(req, res, next) {

    req.checkBody('name', 'required').notEmpty();
    req.checkBody('type', 'required').notEmpty();
    req.checkBody('type', 'invalid').isIn(['Lock', 'Light Bulb']);
    req.checkBody('mac', 'required').notEmpty();
    req.checkBody('mac', 'invalid').isMACAddress();
    req.checkBody('ip', 'required').notEmpty();
    req.checkBody('ip', 'invalid').isIP();
    req.checkBody('room_id', 'required').notEmpty();
    req.checkBody('room_id', 'invalid').isInt();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    Device.findAll({ where: { name: req.body.name, room_id: req.body.room_id } }).then(function(results) {
        if (results.length === 0) {
            var device = Device.build({
                name: req.body.name,
                type: req.body.type,
                status: false,
                mac: req.body.mac,
                ip: req.body.ip,
                room_id: req.body.room_id
            });

            device.save().then(function(newDevice) {
                req.user.addDevice(newDevice);
                res.status(200).json({
                    status: 'succeeded',
                    device: newDevice
                });
            }).catch(function(err) {
                res.status(500).json({
                    status: 'failed',
                    message: 'Internal server error',
                    error: err
                });
            });
        }
        else {
            var errors = [];
            errors.push({ param: 'name', msg: 'unique violation'});
            res.status(400).json({
               status: 'failed',
               errors: errors
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

module.exports.delete = function(req, res, next) {

    req.checkParams('id', 'invalid').isInt();
    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    Device.destroy({where : {id: req.params.id}}).then(function(affected){
        if(affected === 1){
            res.status(200).json({
                status: "succeeded",
                message: "Device deleted successfully."
            });
        }
        else{
            res.status(404).json({
                status: "failed",
                message: "The requested route was not found."
            });
        }

    }).catch(function(err){
        res.status(500).json({
            status: "failed",
            message: "Internal server error."
        });
    });

};

module.exports.update = function(req, res, next) {
    req.checkParams('id', 'invalid').isInt();
    var obj = {};

    if(req.body.name){
        req.sanitizeBody('name').escape();
        req.sanitizeBody('name').trim();
        obj.name = req.body.name;
    }
    if(req.body.type){
        req.checkBody('type', 'invalid').isIn(['Lock', 'Light Bulb']);
        req.sanitizeBody('type').escape();
        req.sanitizeBody('type').trim();
        obj.type = req.body.type;
    }
    if(req.body.status){
        req.checkBody('status', 'invalid').isBoolean();
        req.sanitizeBody('status').escape();
        req.sanitizeBody('status').trim();
        obj.status = req.body.status;
    }
    if(req.body.mac){
        req.checkBody('mac', 'invalid').isMACAddress();
        req.sanitizeBody('mac').escape();
        req.sanitizeBody('mac').trim();
        obj.mac = req.body.mac;
    }
    if(req.body.ip){
        req.checkBody('ip', 'invalid').isIP();
        req.sanitizeBody('ip').escape();
        req.sanitizeBody('ip').trim();
        obj.ip = req.body.ip;
    }

    var target_room_id;
    if(req.body.room_id){
        req.checkBody('room_id', 'invalid').isInt();
        req.sanitizeBody('room_id').escape();
        req.sanitizeBody('room_id').trim();
        obj.room_id = req.body.room_id;
        target_room_id = req.body.room_id;
    }
    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    Device.findById(req.params.id).then(function(device) {
        if (!device) {
            res.status(404).json({
                status: "failed",
                message: "The requested route was not found."
            });
        }
        else {
            if (!target_room_id) {
                target_room_id = device.room_id;
            }

            Device.findAll({ where: { $and: [{ name: req.body.name, room_id: target_room_id }, { id: { $ne: req.params.id } }] } }).then(function(results) {
                if (results.length === 0) {
                    Device.update(obj, {where : {id: req.params.id}}).then(function(affected){
                        if(affected[0] === 1){
                            res.status(200).json({
                                status: "succeeded",
                                message: "Device updated successfully."
                            });
                        }
                        else{
                            res.status(404).json({
                                status: "failed",
                                message: "The requested route was not found."
                            });
                        }
                    }).catch(function(err) {
                        res.status(500).json({
                            status: 'failed',
                            message: 'Internal Server Error'
                        });
                    });
                }
                else {
                    var errors = [];
                    errors.push({ param: 'name', msg: 'unique violation'});
                    res.status(400).json({
                       status: 'failed',
                       errors: errors
                    });
                }
            }).catch(function(err) {
                res.status(500).json({
                    status: 'failed',
                    message: 'Internal server error',
                    error: err
                });
            });
        }
    });
};

module.exports.index = function(req, res, next) {

    req.user.getDevices().then(function(devices){

        res.status(200).json({
            status: 'succeeded',
            devices: devices
        });

    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });

    });
};

module.exports.handle = function(req, res, next) {
    req.checkParams('id', 'invalid').isInt();
    req.checkBody('status', 'required').notEmpty();
    req.checkBody('status', 'invalid').isBoolean();
    req.sanitizeBody('status').escape();
    req.sanitizeBody('status').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    req.user.getDevices().then(function(devices) {
        var idx = -1;

        for (var i = 0; i < devices.length && idx == -1; i++) {
            if (devices[i].id == req.params.id) {
                idx = i;
            }
        }

        if (idx == -1) {
            res.status(401).json({
                status:'failed',
                message: 'The requested route was not found.'
            });

            return;
        }

        var device = devices[idx];
        if (req.body.status === 'true') {
            Script.turnOn(device, function(message, err) {
                if (err) {
                    res.status(500).json({
                        status: 'failed',
                        message: 'Internal server error'
                    });

                    return;
                }
                else {
                    Device.update({ status: true }, { where : { id : device.id } }).then(function(newDevice) {
                        res.status(200).json({
                            status: 'succeeded',
                            message: message
                        });

                    });
                    Patterns.proccessEvent(req.user,req.body.status,device.name, device.id,null);
                    return;
                }
            });
        }
        else {
            Script.turnOff(device, function(message, err) {
                if (err) {
                    res.status(500).json({
                        status: 'failed',
                        message: 'Internal server error'
                    });

                    return;
                }
                else {
                    Device.update({ status: false }, { where : { id : device.id } }).then(function(newDevice) {
                        res.status(200).json({
                            status: 'succeeded',
                            message: message
                        });
                        Patterns.proccessEvent(req.user,req.body.status,device.name, device.id,null);
                        return;
                    });
                }
            });
        }

    });
};

module.exports.scan = function(req, res, next) {
    Script.scan(1000, true, function(results, err) {
        if (err) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            });
        }
        else {
            Device.findAll().then(function(devices) {
                var returnDevices = [];
                for (var i = 0; i < results.length; i++) {
                    var found = false;
                    for (var j = 0; j < devices.length; j++) {
                        if (results[i].mac == devices[j].mac) {
                            found = true;
                            break;
                        }
                    }

                    if (found === false) {
                        returnDevices.push(results[i]);
                    }
                }

                res.status(200).json({
                    status: 'succeeded',
                    devices: returnDevices
                });
            }).catch(function(err) {
                res.status(500).json({
                    status: 'failed',
                    message: 'Internal server error'
                });
            });
        }

        return;
    });
};

module.exports.updateIPs = function(){
    setInterval(function(){
        Script.scan(500, false, function(results, err){
            if (!err) {
                for (var i = 0; i < results.length; i++) {
                    Device.update({ ip : results[i].ip }, { where : { mac : results[i].mac } });
                }
            }
        });
    }, 3000);
};
