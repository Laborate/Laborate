var $ = require("jquery");
var fs = require('node-fs');
var config = require('./config');
var forever = require('forever-monitor');

//Create Logs Folder
fs.mkdirSync(__dirname + '/../logs/' + config.forever.uid, 0775, true);

//Configure Forever
var child = new (forever.Monitor)(__dirname + '/server.js', {
    uid: config.forever.uid,
    max: config.forever.max_failures,
    silent: config.forever.silent,

    spinSleepTime: 10,

    watch: (config.general.production) ? false : config.forever.watch,
    watchDirectory: __dirname + "/" + config.forever.watch_directory,
    watchIgnoreDotFiles: config.forever.watch_ignore_dot,
    watchIgnorePatterns: $.map(config.forever.watch_ignore_patterns, function(value) {
        return __dirname + "/" + value;
    }),

    env: {
        'NODE_ENV': (config.general.production) ? "production" : "development"
    },

    outFile: __dirname + "/" + config.forever.output_log,
    errFile: __dirname + "/" + config.forever.error_log,

    killTree: true
});

child.on('exit', function () {
	console.log("server.js fully down after " + config.forever.max_failures + " starts.");
	console.log("SERVER DOWN.");
});

child.on('exit:code', function(code) {
	console.log("server.js exited with code " + code);
});

//Start Forver
child.start();
