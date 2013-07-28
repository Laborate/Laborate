var fs = require('node-fs');
var config = require('./config');
var forever = require('forever-monitor');
var crontab = require('crontab');
var path = require('path');
var util = require('util');

//Update Crontab
crontab.load(function(err, tab) {
    require('npm').load(function (err, npm) {
        if (err) { console.log(err); process.exit(1); }

        var npmPrefix = npm.config.get('prefix');
        var npmBinRoot = path.join(npmPrefix, 'bin');
        var nodePath = process.execPath.split('/').slice(0, -1).join('/');
        var exportCommand  = 'export PATH=' + nodePath + ':$PATH';
        var foreverCommand = path.join(npmBinRoot, 'forever');
        var thisCommand = __filename;
        var sysCommand = util.format('%s && %s start %s', exportCommand, foreverCommand, thisCommand);

        tab.remove(tab.findComment("laborate_code"));
        tab.create(sysCommand, "laborate_code").everyReboot();
        tab.save();
    });
});

//Create Logs Folder
fs.mkdirSync(__dirname + '/../logs/' + config.forever.uid, 0775, true);

//Configure Forever
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

//Start Forver
child.start();
