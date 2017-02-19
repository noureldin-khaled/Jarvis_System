var Device = require('../models/Device').Device;


module.exports.store = function(req, res, next) {

   req.checkBody('name', 'required').notEmpty();
   req.checkBody('type', 'required').notEmpty();
   req.checkBody('type', 'invalid').isIn(['Lock', 'Light Bulb']);
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
      status: false,
      mac_address: req.body.mac_address
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

   Device.destroy({where : {id: req.params.idl}}).then(function(affected){
      if(affected === 1){
         res.status(200).json({
            status: "succeeded",
            message: "Device deleted successfully."
         });
      }
      else{
         res.status(404).json({
            status: "succeeded",
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
   if(req.body.mac_address){
      req.checkBody('mac_address').isMACAddress();
      req.sanitizeBody('mac_address').escape();
      req.sanitizeBody('mac_address').trim();
      obj.mac_address = req.body.mac_address;
   }
   var errors = req.validationErrors();

   if (errors) {
      res.status(400).json({
         status: 'failed',
         errors: errors
      });

      return;
   }

   Device.update(obj, {where : {id: req.params.id}}).then(function(affected){

      if(affected[0] === 1){
         res.status(200).json({
            status: "succeeded",
            message: "Device updated successfully."
         });
      }
      else{
         res.status(404).json({
            status: "succeeded",
            message: "The requested route was not found."
         });
      }

   }).catch(function(err) {

      res.status(500).json({
         status: 'failed',
         message: 'Internal Server Error'
      });

   });

};
