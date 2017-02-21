module.exports.defineDevice = function(sequelize) {
   var Sequelize = require("sequelize");
   var bcrypt = require('bcrypt-nodejs');

   module.exports.Device = sequelize.define('device', {
      name: {
         type: Sequelize.STRING(45),
         allowNull: false,
         defaultValue: 'Device'
      },
      type:{
         type:Sequelize.ENUM('Light Bulb','Lock'),
         allowNull: false
      },
      status:{
         type:Sequelize.BOOLEAN,
         allowNull:false,
         defaultValue:false
      },
      mac:{
         type:Sequelize.STRING,
         allowNull:false,
         unique:true
      },
      ip:{
         type:Sequelize.STRING,
         allowNull:false
      }
   },
   {
      underscored: true,
      underscoredAll: true
   }
);
};
