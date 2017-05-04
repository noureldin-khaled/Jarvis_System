const cities = require("all-the-cities");

module.exports.cityConverter = function(req, res, next) {

   req.checkBody('cityName', 'required').notEmpty();

   var errors = req.validationErrors();

   if (errors) {
      res.status(400).json({
         status: 'failed',
         errors: errors
      });

      return;
   }

   var result = cities.filter(city => {
        return city.name.toUpperCase() == req.body.cityName.toUpperCase()
    });
   if(result){
    res.status(200).json({
      status: 'succeeded',
      code: result
    });
   }
   else{
    res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    });
   }

};