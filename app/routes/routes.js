module.exports = function(app) {
   require('./AuthResource')(app);
   require('./DeviceResource')(app);
   require('./RoomResource')(app);
   require('./UserResource')(app);

   app.use(function(req, res, next) {
      res.status(404).json({
         status:'failed',
         message: 'The requested route was not found.'
      });
   });
};
