var fs = require('node-fs');
var config = require('./config');
var forever = require('forever-monitor');

fs.mkdirSync(__dirname + '/../logs/code/', 0775, true);

var child = new (forever.Monitor)('server.js', {
    uid: config.forever.uid,
    max: config.forever.max_failures,
    silent: config.forever.silent,

    watch: config.forever.watch,
    watchDirectory: config.forever.watch_directory,
    watchIgnoreDotFiles: config.forever.watch_ignore_dot,
    watchIgnorePatterns: config.forever.watch_ignore_patterns,

    env: {
        'NODE_ENV': config.general.environment
    },

    logFile: config.forever.forever_log,
    outFile: config.forever.output_log,
    errFile: config.forever.error_log,

    killTree: true
});

child.start();
