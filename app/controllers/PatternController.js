var User = require('../models/User').User;




module.exports.proccessEvent = function(user, status, device_id) {


    var d = new Date();

    var event = {
        time: d.getHours()+':'+d.getMinutes(),
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

    if ((new_minutes - old_minutes) <= 5 && new_hours == old_hours) {

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
    graph = JSON.parse(graph);
    var event = {};

    if (graph === null) {
        graph = [];
    }

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
