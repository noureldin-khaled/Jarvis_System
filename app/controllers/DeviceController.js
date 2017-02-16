var Device = require('../models/Device').Device;
var jwt  = require('jsonwebtoken');


module.exports.storeDevice = function(req, res, next) {

  req.checkBody('name', 'required').notEmpty();
  req.checkBody('type', 'required').notEmpty();
  req.checkBody('type', 'Invalid device type').isIn(['Lock', 'Light Bulb'])
  req.checkBody('status', 'required').notEmpty();
  req.checkBody('status', 'Not a Boolean').isBoolean()
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
     req.user.addDevice(newDevice)
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

module.exports.deleteDevice = function(req, res, next) {

  req.checkParams('id', 'Invalid urlparam').isInt()
  var errors = req.validationErrors();

  if (errors) {
     res.status(400).json({
        status: 'failed',
        errors: errors
     });

     return;
  }

  req.user.getDevices().then(function(devices){
    Device.findOne({where : {id: req.params.id , deleted_at : null}}).then(function(device){
      if(device){
        Device.destroy({ where : { id: req.params.id , deleted_at : null}}).then(function() {
          res.status(200).json({
            status: 'succeeded',
            message: 'device successfully deleted'
          });
        }).catch(function(err) {
           res.status(500).json({
              status: 'failed',
              message: 'Internal server error',
              error: err
           });
        });
      }
      else{
        res.status(400).json({
           status: 'failed',
           message: 'Device already deleted.',
           error: err
        });
      }
    }).catch(function(err) {
       res.status(400).json({
          status: 'failed',
          message: 'Device does not exist for this user.'
       });
    });

  });
};

module.exports.updateDevice = function(req, res, next) {
  req.checkParams('id', 'Invalid urlparam').isInt()
  var errors = req.validationErrors();

  if (errors) {
     res.status(400).json({
        status: 'failed',
        errors: errors
     });

     return;
  }

  req.user.getDevices().then(function(devices){
    Device.findOne({where : {id: req.params.id , deleted_at : null}}).then(function(device){
      if(device){
        if(req.body.name){
          device.name = req.body.name
        }
        if(req.body.type){
          req.checkBody('type', 'Invalid device type').isIn(['Lock', 'Light Bulb'])
          var errors = req.validationErrors();

          if (errors) {
             res.status(400).json({
                status: 'failed',
                errors: errors
             });

             return;
          }
          device.type = req.body.type
        }
        if(req.body.status){
          req.checkBody('status', 'Not a Boolean').isBoolean()

          var errors = req.validationErrors();

          if (errors) {
             res.status(400).json({
                status: 'failed',
                errors: errors
             });

             return;
          }
          device.status = req.body.status
        }
        if(req.body.mac_address){
          req.checkBody('mac_address').isMACAddress();

          var errors = req.validationErrors();

          if (errors) {
             res.status(400).json({
                status: 'failed',
                errors: errors
             });

             return;
          }
          device.mac_address = req.body.mac_address
        }

        device.save().then(function(savedDevice) {
           res.status(200).json({
              status: 'succeeded',
              message: 'Device updated',
              device: savedDevice
           });
        });

      }

    }).catch(function(err) {
       res.status(500).json({
          status: 'failed',
          message: 'Internal Server Error'
       });
    });
  }).catch(function(err) {
     res.status(400).json({
        status: 'failed',
        message: 'Device does not exist for this user.'
     });
  });


};
