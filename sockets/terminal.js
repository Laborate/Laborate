var pty = require('pty.js');
var terminal = terminal = require('term.js');
var term;

exports.join = function(req) {
    term = pty.fork(process.env.SHELL || 'sh', [], {
        name: require('fs').existsSync('/usr/share/terminfo/x/xterm-256color')
        ? 'xterm-256color'
        : 'xterm',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME
    });

    term.on('data', function(data) {
        req.io.emit('terminalData', data);
    });

    req.io.respond();
}

exports.data = function(req) {
    term.write(req.data);
}
