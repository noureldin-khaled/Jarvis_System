var Device = require('../models/Device').Device;
var jwt  = require('jsonwebtoken');


module.exports.storeDevice = function(req, res, next) {

  req.checkBody('name', 'required').notEmpty();
  req.checkBody('type', 'required').notEmpty();
  req.checkBody('status', 'required').notEmpty();
  req.checkBody('mac_address', 'required').notEmpty();
  req.checkBody('mac_address').isMACAddress();

  var errors = req.validationErrors();

  if (errors) {
     res.status(400).json({
        status: 'failed',
        errors: errors
     });

     return;
  }

  var device = Device.build({
     name: req.body.name,
     type: req.body.type,
     status: req.body.status,
     mac_address: req.body.mac_address
  });

  device.save().then(function(newDevice) {
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


};
