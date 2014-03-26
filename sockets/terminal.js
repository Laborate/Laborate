var _this = exports;
var pty = require('pty.js');
var terminal = require('term.js');
var terminalUtil = require('./terminalUtil');
var terminals = {};

exports.join = function(req) {
    if(!terminals[req.io.socket.id] && req.session.user) {
        //Start Terminal
        var location = terminalUtil.location(req);
        var term = pty.spawn("ssh", [location.username + "@" + location.host], {
            name: 'xterm-color',
            cols: req.data[0],
            rows: req.data[1]
        });

        term.on('data', function(data) {
            req.io.emit('terminalData', data);
        });

        term.on('close', function() {
            req.io.emit('terminalLeave');
            _this.leave(req);
        });

        req.io.respond();
        terminals[req.io.socket.id] = term;
    }
}

exports.data = function(req) {
    var term = terminals[req.io.socket.id];

    if(term) {
        term.write(req.data);
    }
}

exports.resize = function(req) {
    var term = terminals[req.io.socket.id];

    if(term) {
        //If the user manually disconnects and
        //then does a resize, an error is raised
        try {
            term.resize(req.data[0], req.data[1]);
        } catch(error) {}
    }
}

exports.leave = function(req) {
    var term = terminals[req.io.socket.id];

    if(term) {
        term.destroy();
        delete terminals[req.io.socket.id];
    }
}
