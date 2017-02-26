var User = require('../models/User').User;
var Device = require('../models/Device').Device;

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
         res.status(200).json({
            status: 'succeeded',
            message: 'user successfully updated'
         });
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
         res.status(200).json({
            status: 'succeeded',
            message: 'user successfully updated'
         });
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
               res.status(200).json({
                  status: 'succeeded'
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
