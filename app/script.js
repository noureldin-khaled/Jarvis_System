var Bulb = require('tplink-lightbulb');
var arp = require('node-arp');

module.exports.turnOn = function(device, callback) {
   // TODO : add type checks for devices

   var light = new Bulb(device.ip);

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

   var light = new Bulb(device.ip);

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

var inUse = false;
var scanning = null;
var results = [];
module.exports.scan = function(period, force, callback) {
   if (force) {
      if (scanning) {
         scanning.stop();
         results = [];
      }

      scanning = null;
      inUse = false;
   }

   if (inUse === false) {
      inUse = true;
      results = [];
      scanning = Bulb.scan().on('light', function(light) {
         arp.getMAC(light.ip, function(err, mac) {
            if (err) {
               if (scanning) {
                  scanning.stop();
               }
               callback(null, err);
               scanning = null;
               inUse = false;
            }

            results.push({ ip: light.ip, mac: mac, type: 'Light Bulb' });
         });
      });

      setTimeout(function() {
         if (scanning) {
            scanning.stop();
         }
         callback(removeDups(results), null);
         scanning = null;
         inUse = false;
      }, period);
   }
};

var removeDups = function(array) {
   var res = [];
   for (var i = 0; i < array.length; i++) {
      var found = false;
      for (var j = 0; j < res.length && found === false; j++) {
         if (res[j].mac == array[i].mac)
            found = true;
      }

      if (found === false) {
         res.push(array[i]);
      }
   }

   return res;
};
