var $ = require("jquery");
var fs = require('node-fs');
var config = require('./config');
var forever = require('forever-monitor');

//Update Crontab
require("./cron")();

//Create Logs Folder
fs.mkdirSync(__dirname + '/../logs/' + config.forever.uid, 0775, true);

//Configure Forever
var child = new (forever.Monitor)(__dirname + '/server.js', {
    uid: config.forever.uid,
    max: config.forever.max_failures,
    silent: config.forever.silent,

    watch: config.forever.watch,
    watchDirectory: __dirname + "/" + config.forever.watch_directory,
    watchIgnoreDotFiles: config.forever.watch_ignore_dot,
    watchIgnorePatterns: $.map(config.forever.watch_ignore_patterns, function(value) {
        return __dirname + "/" + value;
    }),

    env: {
        'NODE_ENV': config.general.environment
    },

    logFile: __dirname + "/" + config.forever.forever_log,
    outFile: __dirname + "/" + config.forever.output_log,
    errFile: __dirname + "/" + config.forever.error_log,

    killTree: true
});

//Start Forver
child.start();
