var forever = require('forever-monitor');

var child = new (forever.Monitor)('server.js', {
    max: 3,
    silent: false,
    watch: true,
    watchDirectory: '.',
    //env: { 'NODE_ENV': 'production' }
    //logFile: 'logs/forever.log',
    //outFile: 'logs/output.log',
    //errFile: 'logs/errors.log'
});

child.start();