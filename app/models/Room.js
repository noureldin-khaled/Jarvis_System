module.exports.defineRoom = function(sequelize) {
   var Sequelize = require("sequelize");
   var bcrypt = require('bcrypt-nodejs');

   module.exports.Room = sequelize.define('room', {
      name: {
         type: Sequelize.STRING(45),
         unique: true,
         allowNull: false
      }
   },
   {
      underscored: true,
      underscoredAll: true
   }
);
};
