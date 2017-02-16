var Room = require('../models/Room').Room;

module.exports.addRoom = function(req, res, next) {

    req.checkBody('name', 'required').notEmpty();
    req.sanitizeBody('name').escape();
    req.sanitizeBody('name').trim();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    var room = Room.build({
        name: req.body.name
    });

    room.save().then(function(rm) {

        res.status(200).json({
            status: 'succeeded',
            room: rm
        });
    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });
    });
};

module.exports.editRoom = function(req, res, next) {

    req.checkBody('name', 'required').notEmpty();
    req.sanitizeBody('name').escape();
    req.sanitizeBody('name').trim();
    req.checkParams('id', 'Invalid urlparam').isInt();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    Room.findOne({ where: { id: req.params.id } }).then(function(room) {
        room.name = req.body.name;
        room.save().then(function(rm) {
            res.status(200).json({
                status: 'succeeded',
                room: rm
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error',
                error: err
            });
        });

    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });
    });
};

module.exports.deleteRoom = function(req, res, next) {
    req.checkParams('id', 'Invalid urlparam').isInt();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }

    Room.findOne({ where: { id: req.params.id } }).then(function(room) {

        room.destroy().then(function() {
            res.status(200).json({
                status: 'succeeded'
            });
        }).catch(function(err) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error',
                error: err
            });
        });

    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });
    });

};

module.exports.getRooms = function(req, res, next) {
    Room.findAll().then(function(rooms) {
        res.status(200).json({
            status: 'succeeded',
            rooms: rooms
        });
    }).catch(function(err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
            error: err
        });
    });
};
