var Room = require('../models/Room').Room;

module.exports.store = function(req, res, next) {

   req.checkBody('name', 'required').notEmpty();
   req.sanitizeBody('name').escape();
   req.sanitizeBody('name').trim();

   var errors = req.validationErrors();

   if (errors) {
      res.status(400).json({
         status: 'failed',
         errors: errors
      });

      return;
   }

   var room = Room.build({
      name: req.body.name
   });

   room.save().then(function(rm) {

      res.status(200).json({
         status: 'succeeded',
         room: rm
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
};

module.exports.update = function(req, res, next) {
   req.checkParams('id', 'invalid').isInt();
   var obj = {};

   if (req.body.name) {
      req.sanitizeBody('name').escape();
      req.sanitizeBody('name').trim();
      obj.name = req.body.name;
   }

   var errors = req.validationErrors();

   if (errors) {
      res.status(400).json({
         status: 'failed',
         errors: errors
      });

      return;
   }

   Room.update(obj, {
      where: {
         id: req.params.id
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
            message: 'The requested route was not found.'
         });
      }
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

   Room.destroy({ where: { id: req.params.id } }).then(function(affected) {
      if (affected === 1) {
         res.status(200).json({
            status: 'succeeded'
         });
      }
      else {
         res.status(404).json({
            status: 'failed',
            message: 'The requested route was not found.'
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

module.exports.index = function(req, res, next) {
   Room.findAll().then(function(rooms) {
      res.status(200).json({
         status: 'succeeded',
         rooms: rooms
      });
   }).catch(function(err) {
      res.status(500).json({
         status: 'failed',
         message: 'Internal server error',
         error: err
      });
   });
};
