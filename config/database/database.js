var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,
{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    define: {
        charset: 'utf8'
    }
});

module.exports.init = function(callback) {
   // Models
   require('../../app/models/User').defineUser(sequelize);
   require('../../app/models/Room').defineRoom(sequelize);
   require('../../app/models/Device').defineDevice(sequelize);

   // Relations
   require('../../app/models/Relations');

   var force = (process.env.RESET_DB === 'true')? true : false;

   sequelize.sync({ force: force }).then(function(err) {
        callback();
    }, function (err) {
        callback(err);
    });
};
