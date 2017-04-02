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
      type: {
         type: Sequelize.ENUM('Admin', 'Normal'),
         allowNull: false
      },
      token: {
         type: Sequelize.STRING,
         allowNull: true,
         unique: true
      },
      lastEvent: {
         type: Sequelize.JSON,
         allowNull: true
      },
      sequence: {
         type: Sequelize.JSON,
         allowNull: true
      },
      graph: {
         type: Sequelize.JSON,
         allowNull: true
      },
      patterns: {
         type: Sequelize.JSON,
         allowNull:true
      }
   },
   {
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
         },
         isAdmin: function() {
            return this.type === 'Admin';
         }
      }
   }
);
};
