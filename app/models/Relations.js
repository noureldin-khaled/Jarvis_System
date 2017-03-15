var User = require('./User').User;
var Device = require('./Device').Device;
var Room = require('./Room').Room;

User.belongsToMany(Device, { through: 'user_device' });
Device.belongsToMany(User, { through: 'user_device' });

Room.hasMany(Device, { onDelete: 'CASCADE' });
Device.belongsTo(Room, { onDelete: 'NO ACTION' });
