var config = require('./config');
var forever = require('forever-monitor');

var child = new (forever.Monitor)('server.js', {
    max: config.general.max_failures,
    silent: config.general.silent,

    watch: config.general.watch,
    watchDirectory: config.general.watch_directory,
    watchIgnoreDotFiles: config.general.watch_ignore_dot,
    watchIgnorePatterns: config.general.watch_ignore_patterns,

    env: {
        'NODE_ENV': config.general.environment
    },

    //logFile: config.general.forever_log,
    //outFile: config.general.output_log,
    //errFile: config.general.error_log,

    killTree: true
});

child.start();