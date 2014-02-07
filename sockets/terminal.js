var pty = require('pty.js');
var terminal = require('term.js');
var terminalUtil = require('./terminalUtil');

var term;

exports.join = function(req) {
    if(!term) {
        //Join Room
        req.io.join(terminalUtil.location(req, true));

        //Start Terminal
        var location = terminalUtil.location(req);

        term = pty.fork("ssh", [location.username + "@" + location.host], {
            name: 'xterm-color',
            cols: req.data[0],
            rows: req.data[1]
        });

        term.on('data', function(data) {
            req.io.emit('terminalData', data);
        });

        req.io.respond();
    }
}

exports.data = function(req) {
    if(term) {
        term.write(req.data);
    }
}

exports.resize = function(req) {
    if(term) {
        term.resize(req.data[0], req.data[1]);
    }
}

exports.leave = function(req) {
    if(term) {
        term.destroy();
        term = null;
    }
}
