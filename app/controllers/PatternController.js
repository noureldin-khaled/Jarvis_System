var User = require('../models/User').User;
var freq = 1;

module.exports.update = function(req, res, next) {

    req.checkBody('time', 'required').notEmpty();

    var user = req.user;
    var patterns = user.patterns;
    patterns = JSON.parse(patterns);
  
    var sequence_id = req.params.sequenceid;
    var event_id = req.params.eventid;
    patterns[sequence_id][event_id].time = req.body.time;

    user.patterns = patterns;


    user.save().then(function(){
        res.status(200).json({
            status:'succeeded',
            message:'Done'
        });
    });
    
};



module.exports.getPatterns = function(req, res, next) {


    var user = req.user;
    var graph = user.graph;
    graph = JSON.parse(graph);
    var patterns = user.patterns;
    if (patterns === null) {
        patterns = [];
    }
    var sequence = [];
    for (var i = 0; i < graph.length; i++) {

        if (graph[i].count >= freq) {
            sequence = getSequence(graph, graph[i].event);
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

var getSequence = function(graph, event) {

    var sequence = [event];
    var eventParent = event;
    var i = 0;
    while (i < graph.length) {
        if (graph[i].event.time == eventParent.time && graph[i].event.device == eventParent.device && graph[i].event.status == eventParent.status) {

            if (graph[i].edges.length === 0) {
                return sequence;
            }

            for (var j = 0; j < graph[i].edges.length; j++) {
                if (graph[i].edges[j].count >= freq) {
                    eventParent = graph[i].edges[j].event;
                    sequence.push(eventParent);
                    i = 0;
                    break;
                }
            }
            continue;
        }
        i++;
    }

};


module.exports.proccessEvent = function(user, status, device_id) {


    var d = new Date();

    var mins  = d.getMinutes();

    var str = ''+mins;
    if(mins<10)
        str = '0'+str;

    var hours  = d.getHours();
    var str1 = ''+hours;
    if(hours<10)
        str1 = '0'+str1;


    var event = {
        time: d.getHours() + ':' + str,
        device: device_id,
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


    var new_minutes = d.getMinutes();
    var new_hours = d.getHours();

    user.lastEvent = event;

    if ((new_minutes - old_minutes) <= 1 && new_hours === old_hours) {

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
            if (graph[j].event.time == event.time && graph[j].event.device == event.device && graph[j].event.status == event.status) {
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
                edges: [],
                event: event
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
