var User = require('../models/User').User;


module.exports.put = function(req, res, next) {

    proccessEvent(req.user, req.body.status, req.body.device, req.body.device_id, req.body.time);
    res.status(200).json({ "message": "OK" });
};

module.exports.getGraph = function(req,res,next){
    var user = req.user;
    res.status(200).json({"graph": JSON.parse(user.graph)});
};



module.exports.delete = function(req, res, next) {

    var user = req.user;
    var patterns = user.patterns;
    patterns = JSON.parse(patterns);
    var graph = user.graph;
    graph = JSON.parse(graph);

    var sequence_id = req.params.sequenceid;

    var j = 0;
    for (var i = 0; i < graph.length; i++) {
        if (j > patterns[sequence_id].length - 1 && j!==0)
            break;
        if (graph[i].event.time == patterns[sequence_id][j].time && graph[i].event.device_id == patterns[sequence_id][j].device_id && graph[i].event.status == patterns[sequence_id][j].status) {
            j++;
            for (var k = 0; k < graph[i].edges.length; k++) {
                if (graph[i].edges[k].event.time == patterns[sequence_id][j].time && graph[i].edges[k].event.device_id == patterns[sequence_id][j].device_id && graph[i].edges[k].event.status == patterns[sequence_id][j].status) {
                    if(j==1){

                        graph[i].count-= graph[i].edges[k].count;
                    }
                    graph[i].edges.splice(k, 1);
                    break;
                }
            }
        }
    }
    patterns.splice(sequence_id, 1);
    user.patterns = patterns;
    user.graph = graph;

    user.save().then(function() {
        res.status(200).json({
            status: 'succeeded',
            message: 'Done'
        });
    });
};



module.exports.update = function(req, res, next) {

    req.checkBody('time', 'required').notEmpty();

    var user = req.user;
    var patterns = user.patterns;
    var graph = user.graph;
    graph = JSON.parse(graph);
    patterns = JSON.parse(patterns);

    var sequence_id = req.params.sequenceid;
    var event_id = req.params.eventid;

    var sequence = patterns[sequence_id];

    if(event_id == sequence.length -1){
        res.status(500).json({"message":"Delete pattern instead xD"});
        return;
    }
    var j = 0;
    for (var i = 0; i < graph.length; i++) {
        if (graph[i].event.time == sequence[j].time && graph[i].event.device_id == sequence[j].device_id && graph[i].event.status == sequence[j].status) {
            
            if (j == event_id) {
               
                graph[i].event.time = req.body.time;
                break;
            }
           
            j++;
            for (var k = 0; i < graph[i].edges.length; k++) {
                var edge = graph[i].edges[k];
                
                if (edge.event.time == sequence[j].time && edge.event.device_id == sequence[j].device_id && edge.event.status == sequence[j].status){
                    i=0;
                    if (j == event_id) {
                        
                        graph[i].edges[k].event.time = req.body.time;
                        break;
                    }
                }
            }
        }
    }
    patterns[sequence_id][event_id].time = req.body.time;
    

    user.patterns = patterns;
    user.graph = graph;


    user.save().then(function() {
        res.status(200).json({
            status: 'succeeded',
            message: 'Done'
        });
    });

};



module.exports.getPatterns = function(req, res, next) {

    var user = req.user;
    var graph = user.graph;
    var freq = 1; //user.frequency;

    graph = JSON.parse(graph);
    //var patterns = user.patterns;
    //patterns = JSON.parse(patterns);

    patterns = [];

    if (graph === null) {
        res.status(200).json({
            status: 'OK',
            patterns: patterns
        });
        return;
    }
    var sequence = [];
    for (var i = 0; i < graph.length; i++) {

        if (graph[i].count >= freq) {
            sequence = getSequence(graph, graph[i].event, freq);
            patterns.push(sequence);
        }

    }

    user.patterns = patterns;

    user.save().then(function() {
        res.status(200).json({
            status: 'OK',
            patterns: patterns
        });
    });

};

var getSequence = function(graph, e, freq) {

    var sequence = [e];
    var eventParent = e;

    var i = 0;
    while (i < graph.length) {
        if (graph[i].event.time == eventParent.time && graph[i].event.device_id == eventParent.device_id && graph[i].event.status == eventParent.status) {

            if (graph[i].edges.length === 0) {
                return sequence;
            }

            for (var j = 0; j < graph[i].edges.length; j++) {
                if (graph[i].edges[j].count >= freq) {
                    eventParent = graph[i].edges[j].event;
                    sequence.push(eventParent);
                    i = -1;
                    break;
                }
            }
        }
        i++;
    }

};




var proccessEvent = function(user, status, device, device_id, time) {


    var d = new Date();

    var mins = d.getMinutes();

    var str = '' + mins;
    if (mins < 10)
        str = '0' + str;

    var hours = d.getHours();
    var str1 = '' + hours;
    if (hours < 10)
        str1 = '0' + str1;


    var event = {
        time: time === null ? (str1 + ':' + str) : time,
        device: device,
        device_id: device_id,
        status: status
    };


    if (user.lastEvent === null || user.lastEvent === undefined) {

        user.lastEvent = event;
        user.sequence = [event];
        user.save().then(function() {});
        return;

    }

    var old_event = user.lastEvent;
    old_event = JSON.parse(old_event);

    var old_time = old_event.time;
    var res = old_time.split(':');
    var old_minutes = parseInt(res[1]);
    var old_hours = parseInt(res[0]);

    var current_sequence = user.sequence;
    current_sequence = JSON.parse(current_sequence);

    var r;
    if (time !== null)
        r = time.split(':');

    var new_minutes = time === null ? d.getMinutes() : parseInt(r[1]);
    var new_hours = time === null ? d.getHours() : parseInt(r[0]);

    user.lastEvent = event;

    if ((new_minutes - old_minutes) <= 5 && new_hours === old_hours) {

        current_sequence.push(event);
        user.sequence = current_sequence;
        user.save().then(function() {});
    } else {

        user.sequence = [event];

        user.save().then(function(user) {
            addToGraph(current_sequence, user);
        });

    }


};


function addToGraph(sequence, user) {

    var graph = user.graph;

    if (graph === null) {
        graph = [];
    } else {
        graph = JSON.parse(graph);
    }

    var event = {};

    var k = 1;
    for (var i = 0; i < sequence.length; i++) {
        event = sequence[i];
        var found = false;
        var index = 0;
        for (var j = 0; j < graph.length; j++) {
            if (graph[j].event.time == event.time && graph[j].event.device_id == event.device_id && graph[j].event.status == event.status) {
                if (i === 0)
                    graph[j].count++;
                found = true;
                index = j;
                break;
            }
        }
        if (!found) {
            var new_node = {
                count: i === 0 ? 1 : 0,
                event: event,
                edges: [],
                color: null
            };
            graph.push(new_node);
            index = graph.length - 1;

        }
        if (k == sequence.length)
            break;
        var node = graph[index];
        found = false;
        for (var j = 0; j < node.edges.length; j++) {
            if (sequence[k].time == node.edges[j].event.time && sequence[k].device == node.edges[j].event.device && sequence[k].status == node.edges[j].event.status) {
                node.edges[j].count++;
                found = true;
            }
        }

        if (!found) {
            var new_edge = {
                count: 1,
                event: sequence[k]
            };
            node.edges.push(new_edge);

        }
        k++;
    }

    user.graph = graph;
    user.save().then(function() {});
}

module.exports.updateFrequency = function() {

    setInterval(updateUsers, 86400000);

};

module.exports.proccessEvent = proccessEvent;

function updateUsers() {

    User.findAll().then(function(users) {

        for (var i = 0; i < users.length; i++) {
            var timer = users[i].timer;
            var freq = users[i].frequency;
            if (timer === 0) {
                freq++;
                users[i].frequency = freq;
            } else {
                timer = timer - 86400000;
                users[i].timer = timer;
            }
            users[i].save();
        }

    });
}
