var Bulb = require('tplink-lightbulb');

module.exports.turnOn = function(device, callback) {
   // TODO : add type checks for devices
   // TODO : convert mac address of `device` into ip address

   var light = new Bulb('192.168.0.102');

   if (device.status === true) {
      callback('The device is already turned on!', null);
   }
   else {
      light.set(true).then(function(status) {
         callback('Turned on successfully', null);
      }).catch(function(err) {
         callback('', err);
      });
   }
};

module.exports.turnOff = function(device, callback) {
   // TODO : add type checks for devices
   // TODO : convert mac address of `device` into ip address

   var light = new Bulb('192.168.0.102');

   if (device.status === false) {
      callback('The device is already turned off!', null);
   }
   else {
      light.set(false).then(function(status) {
         callback('Turned off successfully', null);
      }).catch(function(err) {
         callback('', err);
      });
   }
};

module.exports.scan = function(period, callback) {
   var results = [];
   var scan = Bulb.scan().on('light', function(light) {
      results.push(light);
   });
   setTimeout(function() {
      scan.stop();
      callback(results);
   }, period);
};
