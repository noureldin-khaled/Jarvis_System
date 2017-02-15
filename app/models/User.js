module.exports.defineUser = function(sequelize) {
   var Sequelize = require("sequelize");
   var bcrypt = require('bcrypt-nodejs');

   module.exports.User = sequelize.define('user', {
      username: {
         type: Sequelize.STRING(35),
         unique: true,
         allowNull: false
      },
      password: {
         type: Sequelize.STRING,
         set: function(value){
            this.setDataValue('password', bcrypt.hashSync(value));
         },
         allowNull: false
      },
      token: {
         type: Sequelize.STRING,
         allowNull: true,
         unique: true
      }
   },
   {
      paranoid: true,
      underscored: true,
      underscoredAll: true,
      instanceMethods:
      {
         validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
         },
         nullifyToken: function(callback) {
            this.token = null;
            callback();
         }
      }
   }
);
};
