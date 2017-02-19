var Device = require('../models/Device').Device;


module.exports.store = function(req, res, next) {

  req.checkBody('name', 'required').notEmpty();
  req.checkBody('type', 'required').notEmpty();
  req.checkBody('type', 'invalid').isIn(['Lock', 'Light Bulb'])
  req.checkBody('status', 'required').notEmpty();
  req.checkBody('status', 'invalid').isBoolean()
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

module.exports.delete = function(req, res, next) {

  req.checkParams('id', 'invalid').isInt()
  var errors = req.validationErrors();

  if (errors) {
     res.status(400).json({
        status: 'failed',
        errors: errors
     });

     return;
  }

  req.user.getDevices().then(function(devices){

    var found = false
    for (var i = 0; i < devices.length; i++){
      if(devices[i].id == req.params.id){
        found = true
      }
    }
    if(found){
      Device.destroy({where : {id: req.params.id, deleted_at: null}}).then(function(device){
        res.status(200).json({
          status: "succeeded",
          message: "Device deleted successfully."
        });
      }).catch(function(err){
        res.status(400).json({
          status: "failed",
          message: "Device does not exist"
        });
      });
    }
    else{
      res.status(400).json({
        status: "failed",
        message: "Device does not exist or user not authorized to delete device"
      });
    }
  }).catch(function(err){
    res.status(500).json({
      status: "failed",
      message: "Internal server error"
    });
  });

};

module.exports.update = function(req, res, next) {
  req.checkParams('id', 'invalid').isInt()
  var errors = req.validationErrors();

  if (errors) {
     res.status(400).json({
        status: 'failed',
        errors: errors
     });

     return;
  }

  req.user.getDevices().then(function(devices){

    var found = false
    for (var i = 0; i < devices.length; i++){
      if(devices[i].id == req.params.id){
        found = true
      }
    }

    if(found){

      Device.findOne({where : {id: req.params.id , deleted_at : null}}).then(function(device){
        if(device){
          if(req.body.name){
            device.name = req.body.name
          }
          if(req.body.type){
            req.checkBody('type', 'invalid').isIn(['Lock', 'Light Bulb'])
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
            req.checkBody('status', 'invalid').isBoolean()

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

    }
    else{
      res.status(400).json({
         status: 'failed',
         message: "Device does not exist or user not authorized to delete device"
      });
    }

  }).catch(function(err) {

    res.status(500).json({
       status: 'failed',
       message: 'Internal Server Error'
    });

  });

};
